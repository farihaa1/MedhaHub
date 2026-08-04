export const PDF_IMPORT_STATUS = {
  UPLOADED: "UPLOADED",
  PROCESSING: "PROCESSING",
  REVIEW: "REVIEW",
  COMPLETED: "COMPLETED",
  FAILED: "FAILED",
} as const;

export type PdfImportStatus =
  (typeof PDF_IMPORT_STATUS)[keyof typeof PDF_IMPORT_STATUS];

export const PDF_TYPE = {
  PREVIOUS_QUESTION: "PREVIOUS_QUESTION",
  SOLVED_GUIDE: "SOLVED_GUIDE",
  READING_MATERIAL: "READING_MATERIAL",
  UNKNOWN: "UNKNOWN",
} as const;

export type PdfType = (typeof PDF_TYPE)[keyof typeof PDF_TYPE];

export const QUESTION_STATUS = {
  AUTO_IMPORTED: "AUTO_IMPORTED",
  NEEDS_REVIEW: "NEEDS_REVIEW",
  MANUAL: "MANUAL",
  APPROVED: "APPROVED",
} as const;

export type QuestionStatus =
  (typeof QUESTION_STATUS)[keyof typeof QUESTION_STATUS];
