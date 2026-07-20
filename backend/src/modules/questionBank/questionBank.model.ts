// src/app/modules/questionBanks/questionBank.model.ts

import { Schema, model } from "mongoose";

import { QuestionBankModel, TQuestionBank } from "./questionBank.interface";

import {
  QUESTION_BANK_CATEGORY,
  QUESTION_BANK_PAPER,
  QUESTION_BANK_VISIBILITY,
} from "./questionBank.constant";

const questionBankSchema = new Schema<TQuestionBank, QuestionBankModel>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    category: {
      type: String,
      required: true,
      enum: QUESTION_BANK_CATEGORY,
    },

    year: {
      type: Number,
    },

    paper: {
      type: String,
      enum: QUESTION_BANK_PAPER,
    },

    organization: {
      type: String,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
    },

    visibility: {
      type: String,
      enum: QUESTION_BANK_VISIBILITY,
      default: "PUBLIC",
    },

    totalQuestions: {
      type: Number,
      default: 0,
    },

    isPublished: {
      type: Boolean,
      default: true,
    },

    isPremium: {
      type: Boolean,
      default: false,
    },

    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },

    deletedAt: {
      type: Date,
      default: null,
    },

    deletedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

questionBankSchema.index({
  category: 1,
  year: -1,
});

questionBankSchema.index({
  title: "text",
  organization: "text",
  description: "text",
});

questionBankSchema.statics.isSlugExists = async function (slug: string) {
  return await this.findOne({
    slug,
    isDeleted: false,
  });
};

export const QuestionBank = model<TQuestionBank, QuestionBankModel>(
  "QuestionBank",
  questionBankSchema,
);
