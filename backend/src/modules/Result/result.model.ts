import { Schema, model } from "mongoose";
import { IResult } from "./result.interface";

const resultSchema = new Schema<IResult>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    sessionId: {
      type: Schema.Types.ObjectId,
      ref: "ExamSession",
      required: true,
      unique: true,
    },

    examType: {
      type: String,
      required: true,
    },

    totalQuestions: Number,

    attempted: Number,

    correct: Number,

    wrong: Number,

    skipped: Number,

    score: Number,

    accuracy: Number,

    negativeMark: Number,

    submittedAt: Date,
  },
  {
    timestamps: true,
  },
);

export const Result = model<IResult>("Result", resultSchema);
