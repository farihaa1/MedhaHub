import { Router } from "express";

import { uploadPdf } from "./uploader/multer";

import { PdfImportController } from "./pdfImportController";

const router = Router();

router.post(
  "/upload",

  uploadPdf.single("pdf"),

  PdfImportController.uploadPdf,
);

router.get(
  "/:id",

  PdfImportController.getPdfImportById,
);

export default router;
