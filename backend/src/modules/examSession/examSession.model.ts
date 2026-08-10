
import mongoose, {
  Schema,
  Document,
  Types,
} from "mongoose";

import {
  ExamSessionStatus,
  TExamSessionStatus,
} from "./examSession.constant";

// ============================================================
// SESSION QUESTION
// ============================================================

export interface IExamSessionQuestion {
  questionId: Types.ObjectId;
  order: number;
}

// ============================================================
// SESSION ANSWER
// ============================================================

export interface IExamSessionAnswer {
  questionId: Types.ObjectId;

  selectedOption?: "A" | "B" | "C" | "D";

  correctOption?: "A" | "B" | "C" | "D";

  isCorrect?: boolean;

  timeTaken?: number;
}

// ============================================================
// SESSION RESULT
// ============================================================

export interface IExamSessionResult {
  score: number;

  correct: number;

  wrong: number;

  skipped: number;

  accuracy: number;
}

// ============================================================
// EXAM SESSION
// ============================================================

export interface IExamSession extends Document {
  userId: Types.ObjectId;

  examType: string;

  questions: IExamSessionQuestion[];

  duration: number;

  totalMarks: number;

  negativeMark: number;

  answers: IExamSessionAnswer[];

  settings: {
    shuffleQuestions: boolean;

    shuffleOptions: boolean;
  };

  // IMPORTANT
  status: TExamSessionStatus;

  startTime: Date;

  submittedAt?: Date;

  endTime?: Date;

  result?: IExamSessionResult;

  createdAt: Date;

  updatedAt: Date;
}

// ============================================================
// QUESTION SCHEMA
// ============================================================

const examSessionQuestionSchema = new Schema(
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

// ============================================================
// ANSWER SCHEMA
// ============================================================

const examAnswerSchema = new Schema(
  {
    questionId: {
      type: Schema.Types.ObjectId,

      ref: "Question",

      required: true,
    },

    selectedOption: {
      type: String,

      enum: ["A", "B", "C", "D"],
    },

    correctOption: {
      type: String,

      enum: ["A", "B", "C", "D"],
    },

    isCorrect: {
      type: Boolean,
    },

    timeTaken: {
      type: Number,
    },
  },
  {
    _id: false,
  },
);

// ============================================================
// RESULT SCHEMA
// ============================================================

const examSessionResultSchema = new Schema(
  {
    score: {
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

    accuracy: {
      type: Number,

      required: true,
    },
  },
  {
    _id: false,
  },
);

// ============================================================
// EXAM SESSION SCHEMA
// ============================================================

const examSessionSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,

      ref: "User",

      required: true,

      index: true,
    },

    examType: {
      type: String,

      required: true,
    },

    questions: {
      type: [examSessionQuestionSchema],

      required: true,
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

    answers: {
      type: [examAnswerSchema],

      default: [],
    },

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

    // ========================================================
    // STATUS
    // ========================================================

    status: {
      type: String,

      enum: Object.values(ExamSessionStatus),

      default: ExamSessionStatus.RUNNING,

      required: true,

      index: true,
    },

    // ========================================================
    // TIME
    // ========================================================

    startTime: {
      type: Date,

      required: true,
    },

    submittedAt: {
      type: Date,
    },

    endTime: {
      type: Date,
    },

    // ========================================================
    // RESULT
    // ========================================================

    result: {
      type: examSessionResultSchema,
    },
  },

  {
    timestamps: true,
  },
);

// ============================================================
// MODEL
// ============================================================

export const ExamSession = mongoose.model<IExamSession>(
  "ExamSession",
  examSessionSchema,
);
