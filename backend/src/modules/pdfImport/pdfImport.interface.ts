import { Types } from "mongoose";

import { PdfImportStatus, PdfType, QuestionStatus } from "./pdfImport.constant";

// ======================================================
// Import Job
// ======================================================

export interface IPdfImport {
  _id?: Types.ObjectId;

  fileName: string;

  originalName: string;

  filePath: string;

  fileSize: number;

  mimeType: string;

  uploadedBy: Types.ObjectId;

  status: PdfImportStatus;

  pdfType: PdfType;

  totalPages: number;

  processedPages: number;

  totalQuestions: number;

  importedQuestions: number;

  reviewQuestions: number;

  failedQuestions: number;

  startedAt?: Date;

  completedAt?: Date;

  error?: string;

  createdAt?: Date;

  updatedAt?: Date;
}

// ======================================================
// Extracted PDF Page
// ======================================================

export interface IPdfPage {
  pageNumber: number;

  text: string;

  width: number;

  height: number;

  imagePath?: string;
}

// ======================================================
// Question Image
// ======================================================

export interface IQuestionImage {
  page: number;

  path: string;

  width: number;

  height: number;
}

// ======================================================
// Question Option
// ======================================================

export interface IQuestionOption {
  label: "A" | "B" | "C" | "D";

  text?: string;

  image?: string;
}

// ======================================================
// Extracted Question
// ======================================================

export interface IExtractedQuestion {
  questionNumber?: number;

  question: string;

  questionImage?: string;

  options: IQuestionOption[];

  answer?: string;

  explanation?: string;

  pageNumber: number;

  confidence: number;

  status: QuestionStatus;

  topic?: string;

  difficulty?: string;

  sourceImage?: string;
}

// ======================================================
// Import Result
// ======================================================

export interface IImportResult {
  totalQuestions: number;

  autoImported: number;

  reviewRequired: number;

  failed: number;

  questions: IExtractedQuestion[];
}
