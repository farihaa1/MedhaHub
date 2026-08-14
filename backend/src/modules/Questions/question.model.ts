import { Schema, model } from "mongoose";

import { IQuestion } from "./question.interface";

import {
  QuestionDifficulty,
  QuestionSourceType,
  QuestionStatus,
  QuestionType,
} from "./question.constant";

import { normalizeQuestion } from "./question.utils";

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
// NORMALIZE OPTION TEXT
// =========================================================

function normalizeOptionText(text: string): string {
  return text.trim().toLowerCase().replace(/\s+/g, " ");
}

// =========================================================
// CREATE OPTION COMPARISON DATA
// =========================================================
//
// Option order does NOT matter.
//
// Example:
//
// A:
// ঢাকা
// চট্টগ্রাম
// খুলনা
// রাজশাহী
//
// B:
// খুলনা
// রাজশাহী
// ঢাকা
// চট্টগ্রাম
//
// Both are considered the same option set.
//
// isCorrect is included because the correct answer matters.
// =========================================================

function getNormalizedOptions(
  options: Array<{
    text: string;
    isCorrect?: boolean;
  }>,
): string[] {
  return options
    .map((option) => {
      const text = normalizeOptionText(option.text);
      const correct = option.isCorrect ? "1" : "0";

      return `${text}::${correct}`;
    })
    .sort();
}

// =========================================================
// CHECK WHETHER TWO QUESTION OPTION SETS ARE IDENTICAL
// =========================================================

function areOptionsSame(
  first: Array<{
    text: string;
    isCorrect?: boolean;
  }>,
  second: Array<{
    text: string;
    isCorrect?: boolean;
  }>,
): boolean {
  const firstOptions = getNormalizedOptions(first);
  const secondOptions = getNormalizedOptions(second);

  if (firstOptions.length !== secondOptions.length) {
    return false;
  }

  return firstOptions.every((value, index) => value === secondOptions[index]);
}

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
      required: true,
    },

    // =======================================================
    // QUESTION TEXT
    // =======================================================

    questionText: {
      type: String,
      required: [true, "প্রশ্ন লিখতে হবে।"],
      trim: true,
    },

    // =======================================================
    // NORMALIZED QUESTION
    // =======================================================

    normalizedQuestion: {
      type: String,
      trim: true,
      required: true,
    },

    // =======================================================
    // QUESTION IMAGE
    // =======================================================

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

          message: "অবশ্যই একটি মাত্র সঠিক উত্তর নির্বাচন করতে হবে।",
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
// NORMALIZE BEFORE SAVE
// =========================================================

questionSchema.pre("save", async function (next) {
  try {
    // -------------------------------------------------------
    // Generate normalized question
    // -------------------------------------------------------

    if (this.isModified("questionText")) {
      this.normalizedQuestion = normalizeQuestion(this.questionText);
    }

    // -------------------------------------------------------
    // Only perform duplicate check for new documents
    // or when question/options are modified.
    // -------------------------------------------------------

    if (
      this.isNew ||
      this.isModified("questionText") ||
      this.isModified("options")
    ) {
      const existingQuestion = await Question.findOne({
        normalizedQuestion: this.normalizedQuestion,
        type: this.type,
        _id: { $ne: this._id },
      }).lean();

      if (existingQuestion) {
        const sameOptions = areOptionsSame(
          this.options.map((option) => ({
            text: option.text,
            isCorrect: option.isCorrect,
          })),
          existingQuestion.options.map((option) => ({
            text: option.text,
            isCorrect: option.isCorrect,
          })),
        );

        if (sameOptions) {
          const error = new Error(
            "এই প্রশ্নটি একই অপশনসহ ইতোমধ্যে ডাটাবেজে বিদ্যমান।",
          );

          return next(error);
        }
      }
    }

    next();
  } catch (error) {
    next(error as Error);
  }
});

// =========================================================
// NORMALIZE BEFORE INSERT MANY
// =========================================================
//
// IMPORTANT:
//
// insertMany() does not execute save middleware.
// Therefore duplicate checking must happen here separately.
// =========================================================

questionSchema.pre("insertMany", async function (next, docs) {
  try {
    // -------------------------------------------------------
    // Normalize all incoming questions
    // -------------------------------------------------------

    for (const doc of docs) {
      if (doc.questionText) {
        doc.normalizedQuestion = normalizeQuestion(doc.questionText);
      }
    }

    // -------------------------------------------------------
    // Check each incoming question against database
    // -------------------------------------------------------

    for (const doc of docs) {
      const existingQuestions = await Question.find({
        normalizedQuestion: doc.normalizedQuestion,
        type: doc.type,
      }).lean();

      for (const existingQuestion of existingQuestions) {
        const sameOptions = areOptionsSame(
          doc.options.map((option: any) => ({
            text: option.text,
            isCorrect: option.isCorrect,
          })),
          existingQuestion.options.map((option: any) => ({
            text: option.text,
            isCorrect: option.isCorrect,
          })),
        );

        if (sameOptions) {
          return next(
            new Error(
              `এই প্রশ্নটি একই অপশনসহ ইতোমধ্যে ডাটাবেজে বিদ্যমান: ${doc.questionText}`,
            ),
          );
        }
      }
    }

    // -------------------------------------------------------
    // Check duplicates inside the same insertMany batch
    // -------------------------------------------------------

    for (let i = 0; i < docs.length; i++) {
      for (let j = i + 1; j < docs.length; j++) {
        if (
          docs[i].normalizedQuestion !== docs[j].normalizedQuestion ||
          docs[i].type !== docs[j].type
        ) {
          continue;
        }

        const sameOptions = areOptionsSame(
          docs[i].options.map((option: any) => ({
            text: option.text,
            isCorrect: option.isCorrect,
          })),
          docs[j].options.map((option: any) => ({
            text: option.text,
            isCorrect: option.isCorrect,
          })),
        );

        if (sameOptions) {
          return next(
            new Error(
              `একই batch-এর মধ্যে duplicate প্রশ্ন পাওয়া গেছে: ${docs[i].questionText}`,
            ),
          );
        }
      }
    }

    next();
  } catch (error) {
    next(error as Error);
  }
});

// =========================================================
// INDEXES
// =========================================================

// Full text search
questionSchema.index({
  questionText: "text",
});

// Normalized question lookup
//
// NOT UNIQUE.
//
// Multiple questions may have the same question text
// when their options are different.
//
questionSchema.index({
  normalizedQuestion: 1,
});

// Academic hierarchy
questionSchema.index({
  subjectId: 1,
  chapterId: 1,
  topicId: 1,
});

// =========================================================
// SOURCE INDEX
// =========================================================

questionSchema.index({
  "sources.type": 1,
  "sources.year": 1,
});

// =========================================================
// DIFFICULTY INDEX
// =========================================================

questionSchema.index({
  difficulty: 1,
});

// =========================================================
// STATUS INDEX
// =========================================================

questionSchema.index({
  status: 1,
});

// =========================================================
// TAGS INDEX
// =========================================================

questionSchema.index({
  tags: 1,
});

// =========================================================
// MODEL
// =========================================================

export const Question = model<IQuestion>("Question", questionSchema);
