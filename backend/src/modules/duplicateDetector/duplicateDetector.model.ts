import { Schema, Types, model } from "mongoose";

import { DuplicateScope, DuplicateStatus } from "./duplicateDetector.constants";

export interface IDuplicatePair {
  questionA: Types.ObjectId;

  questionB: Types.ObjectId;

  similarity: number;

  exactMatch: boolean;

  scope: DuplicateScope;

  scopeId?: Types.ObjectId;

  status: DuplicateStatus;

  detectedAt: Date;

  reviewedAt?: Date;

  reviewedBy?: Types.ObjectId;

  resolution?: {
    keptQuestionId?: Types.ObjectId;

    archivedQuestionId?: Types.ObjectId;
  };
}

const duplicatePairSchema = new Schema<IDuplicatePair>(
  {
    questionA: {
      type: Schema.Types.ObjectId,

      ref: "Question",

      required: true,
    },

    questionB: {
      type: Schema.Types.ObjectId,

      ref: "Question",

      required: true,
    },

    similarity: {
      type: Number,

      required: true,

      min: 0,

      max: 1,

      
    },

    exactMatch: {
      type: Boolean,

      default: false,

     
    },

    scope: {
      type: String,

      enum: Object.values(DuplicateScope),

      required: true,

    },

    scopeId: {
      type: Schema.Types.ObjectId,

      
    },

    status: {
      type: String,

      enum: Object.values(DuplicateStatus),

      default: DuplicateStatus.PENDING,

      
    },

    detectedAt: {
      type: Date,

      default: Date.now,
    },

    reviewedAt: Date,

    reviewedBy: {
      type: Schema.Types.ObjectId,

      ref: "User",
    },

    resolution: {
      keptQuestionId: {
        type: Schema.Types.ObjectId,

        ref: "Question",
      },

      archivedQuestionId: {
        type: Schema.Types.ObjectId,

        ref: "Question",
      },
    },
  },

  {
    timestamps: true,
  },
);

/*
 * Important:
 * questionA/questionB are already sorted
 * before saving.
 */
duplicatePairSchema.index(
  {
    questionA: 1,
    questionB: 1,
    scope: 1,
    scopeId: 1,
  },
  {
    unique: true,
  },
);

duplicatePairSchema.index({
  status: 1,
  similarity: -1,
});

duplicatePairSchema.index({
  scope: 1,
  scopeId: 1,
  similarity: -1,
});

export const DuplicatePair = model<IDuplicatePair>(
  "DuplicatePair",
  duplicatePairSchema,
);
