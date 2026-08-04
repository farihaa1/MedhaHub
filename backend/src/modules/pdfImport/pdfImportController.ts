import { Request, Response } from "express";

import httpStatus from "http-status";

import * as PdfImportService from "./pdfImport.service";

import { catchAsync } from "../../utils/catchAsync";

import { sendResponse } from "../../utils/sendResponse";

const uploadPdf = catchAsync(async (req: Request, res: Response) => {
  console.log("FILE:", req.file);

  console.log("CONTROLLER 1");

  const result = await PdfImportService.uploadPdf(req.file!);

  console.log("CONTROLLER 2");

  sendResponse(res, {
    statusCode: httpStatus.OK,

    success: true,

    message: "PDF uploaded successfully.",

    data: result,
  });

  console.log("CONTROLLER 3");
});

const getPdfImportById = catchAsync(async (req, res) => {
  const result = await PdfImportService.getPdfImportById(req.params.id as string);

  sendResponse(res, {
    statusCode: 200,

    success: true,

    message: "PDF found",

    data: result,
  });
});

export const PdfImportController = {
  uploadPdf,

  getPdfImportById,
};
