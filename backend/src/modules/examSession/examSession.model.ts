import { Schema, model } from "mongoose";

import {
  IExamSession,
  IExamSessionQuestion,
  IExamAnswer,
} from "./examSession.interface";

import { ExamSessionStatus } from "./examSession.constant";
import { ExamType } from "../ExamEngine/examEngine.constant";

// Question schema inside session
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
  {
    _id: false,
  },
);

// Answer schema
const examAnswerSchema = new Schema<IExamAnswer>(
  {
    questionId: {
      type: Schema.Types.ObjectId,
      ref: "Question",
      required: true,
    },

    selectedOption: {
      type: Schema.Types.ObjectId,
      required: false,
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
  {
    _id: false,
  },
);

// Main Exam Session Schema
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

        enum: [
          "topic",
          "chapter",
          "subject",
          "practice_set",
          "model_test",
          "previous_year",
          "daily",
        ],
      },

      id: {
        type: Schema.Types.ObjectId,
      },
    },

    questions: [examSessionQuestionSchema],

    answers: [examAnswerSchema],

    settings: {
      shuffleQuestions: {
        type: Boolean,
        default: false,
      },

      shuffleOptions: {
        type: Boolean,
        default: false,
      },
    },

    duration: {
      type: Number,
      required: true,
    },

    totalMarks: {
      type: Number,
      required: true,
    },

    negativeMark: {
      type: Number,
      default: 0,
    },

    status: {
      type: String,

      enum: Object.values(ExamSessionStatus),

      default: ExamSessionStatus.RUNNING,
    },

    startTime: {
      type: Date,
      required: true,
    },

    endTime: {
      type: Date,
    },

    submittedAt: {
      type: Date,
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
