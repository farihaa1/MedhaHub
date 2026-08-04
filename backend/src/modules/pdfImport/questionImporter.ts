import mongoose from "mongoose";
import httpStatus from "http-status";

import AppError from "../../error/AppError";

import { PdfImport } from "./pdfImport.model";

import { extractPdf } from "./extractor";

import { parserPipeline } from "./parser/parserPipeline";

import { Question } from "../question/question.model";

interface ImportPdfPayload {
  filePath: string;

  pdfImportId: string;

  userId?: string;
}

export const importQuestionsFromPdf = async (payload: ImportPdfPayload) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    /**
     * Update status
     */
    await PdfImport.findByIdAndUpdate(
      payload.pdfImportId,

      {
        status: "PROCESSING",

        progress: 10,
      },

      {
        session,
      },
    );

    /**
     * Step 1
     * Extract PDF
     */
    const extraction = await extractPdf(payload.filePath);

    await PdfImport.findByIdAndUpdate(
      payload.pdfImportId,

      {
        totalPages: extraction.totalPages,

        progress: 50,
      },

      {
        session,
      },
    );

    /**
     * Step 2
     * Prepare parser input
     */
    const parserInput = {
      pages: extraction.pages.map((page) => ({
        pageNumber: page.pageNumber,

        text: page.text,

        imagePaths: page.images.map((img) => img.path),
      })),
    };

    /**
     * Step 3
     * Parse questions
     */
    const result = await parserPipeline(parserInput);

    if (result.questions.length === 0) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "No questions detected from PDF",
      );
    }

    /**
     * Step 4
     * Save questions
     */
    const questions = result.questions.map((question) => ({
      ...question,

      source: "PDF_IMPORT",

      pdfImportId: payload.pdfImportId,

      createdBy: payload.userId,
    }));

    await Question.insertMany(questions, {
      session,
    });

    /**
     * Complete
     */
    await PdfImport.findByIdAndUpdate(
      payload.pdfImportId,

      {
        status: "COMPLETED",

        progress: 100,

        totalQuestions: questions.length,
      },

      {
        session,
      },
    );

    await session.commitTransaction();

    return {
      success: true,

      imported: questions.length,

      failedPages: result.failedPages,
    };
  } catch (error: any) {
    await session.abortTransaction();

    await PdfImport.findByIdAndUpdate(
      payload.pdfImportId,

      {
        status: "FAILED",

        error: error.message,
      },
    );

    throw error;
  } finally {
    session.endSession();
  }
};
