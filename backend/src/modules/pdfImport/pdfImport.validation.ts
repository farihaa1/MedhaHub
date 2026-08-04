import { z } from "zod";

import { PDF_TYPE } from "./pdfImport.constant";

// =========================================
// Upload PDF
// =========================================

const uploadPdfValidationSchema = z.object({
  body: z.object({
    pdfType: z
      .enum([
        PDF_TYPE.PREVIOUS_QUESTION,
        PDF_TYPE.SOLVED_GUIDE,
        PDF_TYPE.READING_MATERIAL,
      ])
      .default(PDF_TYPE.PREVIOUS_QUESTION),

    autoApprove: z.boolean().optional().default(false),

    confidenceThreshold: z.number().min(0).max(100).optional().default(90),

    language: z.enum(["bn", "en"]).optional().default("bn"),
  }),
});

// =========================================
// Start Import
// =========================================

const startImportValidationSchema = z.object({
  params: z.object({
    id: z.string({
      message: "Import id is required",
    }),
  }),
});

// =========================================
// Get Import
// =========================================

const getImportValidationSchema = z.object({
  params: z.object({
    id: z.string({
      message: "Import id is required",
    }),
  }),
});

// =========================================
// Delete Import
// =========================================

const deleteImportValidationSchema = z.object({
  params: z.object({
    id: z.string({
      message: "Import id is required",
    }),
  }),
});

export const PdfImportValidation = {
  uploadPdfValidationSchema,
  startImportValidationSchema,
  getImportValidationSchema,
  deleteImportValidationSchema,
};
