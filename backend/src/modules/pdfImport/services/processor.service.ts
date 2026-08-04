import httpStatus from "http-status";

import AppError from "../../../error/AppError";

import { PdfImport } from "../pdfImport.model";

import { PDF_IMPORT_STATUS, PDF_TYPE } from "../pdfImport.constant";

import { DigitalExtractorService } from "./digitalExtractor.service";
import { PreviousQuestionParser } from "./previousQuestionParser.service";
import { SolvedGuideParser } from "./solvedGuideParser.service";
import { ReadingMaterialParser } from "./readingMaterialParser.service";
import { QuestionSaverService } from "./questionSaver.service";
import { ParserFactory } from "../parsers/parser.factory";
import { LayoutAnalyzerService } from "../layout/layoutAnalyzer.service";

const process = async (job: any) => {
  try {
    //---------------------------------------------------
    // Update Status
    //---------------------------------------------------

    job.status = PDF_IMPORT_STATUS.PROCESSING;
    job.startedAt = new Date();

    await job.save();

    //---------------------------------------------------
    // Extract PDF
    //---------------------------------------------------

    const pdf = await DigitalExtractorService.extract(job.filePath);

    job.totalPages = pdf.totalPages;

    await job.save();

    //---------------------------------------------------
    // Select Parser
    //---------------------------------------------------

    // let questions = [];
    const regions = await LayoutAnalyzerService.analyze(pdf.pages);

    const parser = ParserFactory.get(job.pdfType);

    const questions = await parser.parse(regions);

    //---------------------------------------------------
    // Save Questions
    //---------------------------------------------------

    const result = await QuestionSaverService.save(questions, job);

    //---------------------------------------------------
    // Update Statistics
    //---------------------------------------------------

    job.totalQuestions = result.totalQuestions;

    job.importedQuestions = result.importedQuestions;

    job.reviewQuestions = result.reviewQuestions;

    job.failedQuestions = result.failedQuestions;

    job.status = PDF_IMPORT_STATUS.COMPLETED;

    job.completedAt = new Date();

    await job.save();

    return job;
  } catch (error: any) {
    job.status = PDF_IMPORT_STATUS.FAILED;

    job.error = error.message;

    await job.save();

    throw error;
  }
};

export const PdfProcessorService = {
  process,
};
