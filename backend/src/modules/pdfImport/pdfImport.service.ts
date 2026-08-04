import crypto from "crypto";
import httpStatus from "http-status";

import AppError from "../../error/AppError";

import { convertPdfToImages } from "./extractor/pdfConverter";

export const uploadPdf = async (file: Express.Multer.File) => {
  if (!file) {
    throw new AppError(httpStatus.BAD_REQUEST, "PDF file is required.");
  }

  const pdfId = crypto.randomUUID();

  console.log("STEP 1");

  const {
    totalPages,

    previews,
  } = await convertPdfToImages(file.path, pdfId);

  console.log("STEP 2");

  const response = {
    id: pdfId,

    pdf: {
      originalName: file.originalname,

      filename: file.filename,

      path: file.path,

      size: file.size,

      totalPages,
    },

    previews,
  };

  console.log("STEP 3");

  return response;
};

export const getPdfImportById = async (id: string) => {
  return {
    id,

    message: "PDF import found",
  };
};
