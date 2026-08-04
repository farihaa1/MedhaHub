import mongoose, { Schema, Model } from "mongoose";

export enum PDF_IMPORT_STATUS {
  UPLOADED = "UPLOADED",

  PROCESSING = "PROCESSING",

  COMPLETED = "COMPLETED",

  FAILED = "FAILED",
}

export interface IPdfImport {
  fileName: string;

  filePath: string;

  originalName: string;

  status: PDF_IMPORT_STATUS;

  progress: number;

  totalPages: number;

  totalQuestions: number;

  error?: string;

  createdBy?: mongoose.Types.ObjectId;

  createdAt?: Date;

  updatedAt?: Date;
}

const pdfImportSchema = new Schema<IPdfImport>(
  {
    fileName: {
      type: String,

      required: true,
    },

    filePath: {
      type: String,

      required: true,
    },

    originalName: {
      type: String,

      required: true,
    },

    status: {
      type: String,

      enum: Object.values(PDF_IMPORT_STATUS),

      default: PDF_IMPORT_STATUS.UPLOADED,
    },

    progress: {
      type: Number,

      default: 0,
    },

    totalPages: {
      type: Number,

      default: 0,
    },

    totalQuestions: {
      type: Number,

      default: 0,
    },

    error: {
      type: String,
    },

    createdBy: {
      type: Schema.Types.ObjectId,

      ref: "User",
    },
  },

  {
    timestamps: true,
  },
);

export const PdfImport: Model<IPdfImport> = mongoose.model<IPdfImport>(
  "PdfImport",

  pdfImportSchema,
);
