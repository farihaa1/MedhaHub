import { Schema, model } from "mongoose";

import { IQuestion } from "./question.interface";

import {
  QuestionDifficulty,
  QuestionSourceType,
  QuestionStatus,
  QuestionType,
} from "./question.constant";

// =========================================================
// OPTION SCHEMA
// =========================================================

const optionSchema = new Schema(
  {
    text: {
      type: String,
      required: [true, "অপশনের লেখা আবশ্যক।"],
      trim: true,
    },

    image: {
      type: String,
      default: null,
    },

    isCorrect: {
      type: Boolean,
      default: false,
    },
  },
  {
    _id: true,
  },
);

// =========================================================
// SOURCE SCHEMA
// =========================================================

const sourceSchema = new Schema(
  {
    type: {
      type: String,
      enum: Object.values(QuestionSourceType),
      required: [true, "প্রশ্নের উৎসের ধরন নির্বাচন করা আবশ্যক।"],
    },

    name: {
      type: String,
      required: [true, "প্রশ্নের উৎসের নাম লিখতে হবে।"],
      trim: true,
    },

    year: {
      type: Number,
    },
  },
  {
    _id: false,
  },
);

// =========================================================
// QUESTION SCHEMA
// =========================================================

const questionSchema = new Schema<IQuestion>(
  {
    // =======================================================
    // CLASSIFICATION
    // =======================================================

    subjectId: {
      type: Schema.Types.ObjectId,
      ref: "Subject",
      required: [true, "Subject নির্বাচন করা আবশ্যক।"],
    },

    chapterId: {
      type: Schema.Types.ObjectId,
      ref: "Chapter",
      required: [true, "Chapter নির্বাচন করা আবশ্যক।"],
    },

    topicId: {
      type: Schema.Types.ObjectId,
      ref: "Topic",
      required: [true, "Topic নির্বাচন করা আবশ্যক।"],
    },

    // =======================================================
    // QUESTION TYPE
    // =======================================================

    type: {
      type: String,
      enum: Object.values(QuestionType),
      default: QuestionType.MCQ,
    },

    // =======================================================
    // QUESTION TEXT
    // =======================================================

    questionText: {
      type: String,
      required: [true, "প্রশ্ন লিখতে হবে।"],
      trim: true,
    },

    normalizedQuestion: {
      type: String,
      trim: true,
    },

    questionImage: {
      type: String,
      default: null,
    },

    // =======================================================
    // OPTIONS
    // =======================================================

    options: {
      type: [optionSchema],

      required: [true, "প্রশ্নের অপশন যুক্ত করতে হবে।"],

      validate: [
        {
          validator: (value: any[]) => value.length === 4,

          message: "একটি MCQ প্রশ্নে অবশ্যই ৪টি অপশন থাকতে হবে।",
        },

        {
          validator: (value: any[]) =>
            value.filter((option) => option.isCorrect).length === 1,

          message: "অবশ্যই একটি মাত্র সঠিক উত্তর নির্বাচন করতে হবে.",
        },
      ],
    },

    // =======================================================
    // EXPLANATION
    // =======================================================

    explanation: {
      type: String,
      trim: true,
      default: "",
    },

    explanationImage: {
      type: String,
      default: null,
    },

    // =======================================================
    // SOURCES
    // =======================================================

    sources: {
      type: [sourceSchema],
      default: [],
    },

    // =======================================================
    // DIFFICULTY
    // =======================================================

    difficulty: {
      type: String,
      enum: Object.values(QuestionDifficulty),
    },

    // =======================================================
    // TAGS
    // =======================================================

    tags: {
      type: [String],
      default: [],
    },

    // =======================================================
    // CATEGORY STATUS
    // =======================================================

    isCategorized: {
      type: Boolean,
      default: false,
    },

    // =======================================================
    // WORKFLOW STATUS
    // =======================================================

    status: {
      type: String,
      enum: Object.values(QuestionStatus),
      default: QuestionStatus.PENDING,
    },

    // =======================================================
    // CREATOR
    // =======================================================

    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "প্রশ্নটি কে তৈরি করেছেন তা উল্লেখ করা আবশ্যক।"],
    },

    // =======================================================
    // APPROVAL
    // =======================================================

    approvedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },

    approvedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
);

// =========================================================
// INDEXES
// =========================================================

questionSchema.index({
  questionText: "text",
});

questionSchema.index({
  normalizedQuestion: 1,
});

questionSchema.index({
  subjectId: 1,
  chapterId: 1,
  topicId: 1,
});

questionSchema.index({
  "sources.type": 1,
  "sources.year": 1,
});

questionSchema.index({
  difficulty: 1,
});

questionSchema.index({
  status: 1,
});

questionSchema.index({
  tags: 1,
});

// =========================================================
// NORMALIZE QUESTION
// =========================================================

questionSchema.pre("save", function () {
  this.normalizedQuestion = this.questionText
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, "")
    .replace(/\s+/g, "")
    .trim();
});

// =========================================================
// MODEL
// =========================================================

export const Question = model<IQuestion>("Question", questionSchema);
