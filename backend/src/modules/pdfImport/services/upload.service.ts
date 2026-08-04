import path from "path";

import { PdfImport } from "../pdfImport.model";
import { PDF_IMPORT_STATUS, PDF_TYPE } from "../pdfImport.constant";

const upload = async (file: Express.Multer.File, user: any, body: any) => {
  const job = await PdfImport.create({
    fileName: file.filename,

    originalName: file.originalname,

    filePath: file.path.replace(/\\/g, "/"),

    fileSize: file.size,

    mimeType: file.mimetype,

    uploadedBy: user.userId,

    status: PDF_IMPORT_STATUS.UPLOADED,

    pdfType: body.pdfType ?? PDF_TYPE.PREVIOUS_QUESTION,

    totalPages: 0,

    processedPages: 0,

    totalQuestions: 0,

    importedQuestions: 0,

    reviewQuestions: 0,

    failedQuestions: 0,
  });

  return job;
};

export const PdfUploadService = {
  upload,
};
