import { Schema, model } from "mongoose";

import {
  QuestionBankItemModel,
  TQuestionBankItem,
} from "./questionBankItem.interface";

const questionBankItemSchema = new Schema<
  TQuestionBankItem,
  QuestionBankItemModel
>(
  {
    questionBank: {
      type: Schema.Types.ObjectId,
      ref: "QuestionBank",
      required: true,
    },

    question: {
      type: Schema.Types.ObjectId,
      ref: "Question",
      required: true,
    },

    order: {
      type: Number,
      required: true,
    },

    marks: {
      type: Number,
      default: 1,
    },

    negativeMarks: {
      type: Number,
      default: 0,
    },

    isActive: {
      type: Boolean,
      default: true,
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
  },
  {
    timestamps: true,
  },
);
questionBankItemSchema.index(
  {
    questionBank: 1,
    question: 1,
  },
  {
    unique: true,
  },
);
questionBankItemSchema.index({
  questionBank: 1,
  order: 1,
});
questionBankItemSchema.statics.isQuestionExistsInBank = async function (
  questionBank,
  question,
) {
  return await this.findOne({
    questionBank,
    question,
  });
};

export const QuestionBankItem = model<TQuestionBankItem, QuestionBankItemModel>(
  "QuestionBankItem",
  questionBankItemSchema,
);