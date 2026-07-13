import { Schema, model } from "mongoose";
import { IResult } from "./result.interface";

const resultSchema = new Schema<IResult>(
  {
    sessionId: {
      type: Schema.Types.ObjectId,
      ref: "ExamSession",
      required: true,
      unique: true,
    },

    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    totalQuestions: {
      type: Number,
      required: true,
    },

    attempted: {
      type: Number,
      required: true,
    },

    correct: {
      type: Number,
      required: true,
    },

    wrong: {
      type: Number,
      required: true,
    },

    skipped: {
      type: Number,
      required: true,
    },

    score: {
      type: Number,
      required: true,
    },

    accuracy: {
      type: Number,
      required: true,
    },

    negativeMark: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export const Result = model<IResult>("Result", resultSchema);
