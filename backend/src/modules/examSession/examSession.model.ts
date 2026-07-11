import { Schema, model } from "mongoose";
import {
  IExamSession,
  IExamSessionQuestion,
  IExamAnswer,
} from "./examSession.interface";

import { ExamSessionStatus } from "./examSession.constant";
import { ExamType } from "../ExamEngine/examEngine.constant";

const examSessionQuestionSchema = new Schema<IExamSessionQuestion>(
  {
    questionId: {
      type: Schema.Types.ObjectId,
      ref: "Question",
      required: true,
    },
    order: {
      type: Number,
      required: true,
    },
  },
  { _id: false },
);

const examAnswerSchema = new Schema<IExamAnswer>(
  {
    questionId: {
      type: Schema.Types.ObjectId,
      ref: "Question",
      required: true,
    },

    selectedOption: {
      type: String,
    },

    isCorrect: {
      type: Boolean,
      default: false,
    },

    timeTaken: {
      type: Number,
      default: 0,
    },
  },
  { _id: false },
);

const examSessionSchema = new Schema<IExamSession>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    examType: {
      type: String,
      enum: Object.values(ExamType),
      required: true,
    },

    source: {
      type: {
        type: String,
      },
      id: {
        type: Schema.Types.ObjectId,
      },
    },

    questions: [examSessionQuestionSchema],

    answers: [examAnswerSchema],

    settings: {
      shuffleQuestions: Boolean,
      shuffleOptions: Boolean,
    },

    duration: Number,

    totalMarks: Number,

    negativeMark: Number,

    status: {
      type: String,
      enum: Object.values(ExamSessionStatus),
      default: ExamSessionStatus.RUNNING,
    },

    startTime: Date,

    endTime: Date,

    submittedAt: Date,

    // ===============================
    // Persisted Result
    // ===============================

    result: {
      score: Number,

      correct: Number,

      wrong: Number,

      skipped: Number,

      accuracy: Number,
    },
  },
  {
    timestamps: true,
  },
);

export const ExamSession = model<IExamSession>(
  "ExamSession",
  examSessionSchema,
);
