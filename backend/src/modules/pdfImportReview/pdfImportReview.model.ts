import { Schema, model } from "mongoose";

const optionSchema = new Schema(
  {
    text: String,
    image: String,
    isCorrect: Boolean,
  },
  {
    _id: false,
  },
);

const pdfImportReviewSchema = new Schema(
  {
    pdfImport: {
      type: Schema.Types.ObjectId,
      ref: "PdfImport",
      required: true,
      index: true,
    },

    questionBank: {
      type: Schema.Types.ObjectId,
      ref: "QuestionBanks",
      required: true,
      index: true,
    },

    subjectId: {
      type: Schema.Types.ObjectId,
      ref: "Subject",
      default: null,
    },

    chapterId: {
      type: Schema.Types.ObjectId,
      ref: "Chapter",
      default: null,
    },

    topicId: {
      type: Schema.Types.ObjectId,
      ref: "Topic",
      default: null,
    },

    questionText: {
      type: String,
      required: true,
      trim: true,
    },

    questionImage: String,

    options: {
      type: [optionSchema],
      required: true,
    },

    explanation: {
      type: String,
      default: "",
    },

    explanationImage: String,

    confidence: {
      type: Number,
      default: 0,
      index: true,
    },

    status: {
      type: String,
      enum: ["PENDING", "APPROVED", "REJECTED"],
      default: "PENDING",
      index: true,
    },

    reviewRemark: String,

    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    reviewedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },

    reviewedAt: Date,
  },
  {
    timestamps: true,
  },
);

pdfImportReviewSchema.index({
  pdfImport: 1,
  status: 1,
});

pdfImportReviewSchema.index({
  confidence: 1,
});

export const PdfImportReview = model("PdfImportReview", pdfImportReviewSchema);
