import { Schema, model } from "mongoose";

import { IQuestion } from "./question.interface";
import {
  QuestionDifficulty,
  QuestionSourceType,
  QuestionStatus,
  QuestionType,
} from "./question.constant";

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

const questionSchema = new Schema<IQuestion>(
  {
    subject: {
      type: Schema.Types.ObjectId,
      ref: "Subject",
      required: [true, "বিষয় নির্বাচন করা আবশ্যক।"],
    },

    chapter: {
      type: Schema.Types.ObjectId,
      ref: "Chapter",
      required: [true, "অধ্যায় নির্বাচন করা আবশ্যক।"],
    },

    topic: {
      type: Schema.Types.ObjectId,
      ref: "Topic",
      required: [true, "টপিক নির্বাচন করা আবশ্যক।"],
    },

    type: {
      type: String,
      enum: Object.values(QuestionType),
      default: QuestionType.MCQ,
    },



    questionText: {
      type: String,
      required: [true, "প্রশ্ন লিখতে হবে।"],
      trim: true,
    },

    questionImage: {
      type: String,
      default: null,
    },

    options: {
      type: [optionSchema],
      required: [true, "প্রশ্নের অপশন যুক্ত করতে হবে।"],
      validate: [
        {
          validator: (value: any[]) => value.length === 4,
          message: "একটি এমসিকিউ প্রশ্নে অবশ্যই ৪টি অপশন থাকতে হবে।",
        },
        {
          validator: (value: any[]) =>
            value.filter((option) => option.isCorrect).length === 1,
          message: "অবশ্যই একটি মাত্র সঠিক উত্তর নির্বাচন করতে হবে।",
        },
      ],
    },

    explanation: {
      type: String,
      trim: true,
      default: "",
    },

    explanationImage: {
      type: String,
      default: null,
    },

    sources: {
      type: [sourceSchema],
      default: [],
    },

    difficulty: {
      type: String,
      enum: Object.values(QuestionDifficulty),
    },

    tags: {
      type: [String],
      default: [],
    },

    status: {
      type: String,
      enum: Object.values(QuestionStatus),
      default: QuestionStatus.PENDING,
    },

    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "প্রশ্নটি কে তৈরি করেছেন তা উল্লেখ করা আবশ্যক।"],
    },

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

/* ===========================
   Indexes
=========================== */

questionSchema.index({
  questionText: "text",
});

questionSchema.index({
  subject: 1,
  chapter: 1,
  topic: 1,
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

/* ===========================
   Model
=========================== */

export const Question = model<IQuestion>("Question", questionSchema);
