import { Schema, model } from "mongoose";
import { IQuestionBank, QuestionBankModel } from "./questionBank.interface";
import {
  QUESTION_BANK_CATEGORY,
  QUESTION_BANK_PAPER,
  QUESTION_BANK_VISIBILITY,
} from "./questionBank.constant";

const questionBankSchema = new Schema<IQuestionBank, QuestionBankModel>(
  {
    title: {
      type: String,
      required: [true, "Question bank title is required"],
      trim: true,
    },

    slug: {
      type: String,
      required: [true, "Slug is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },

    category: {
      type: String,
      enum: QUESTION_BANK_CATEGORY,
      required: true,
    },

    year: {
      type: Number,
      min: 1900,
      max: 2100,
    },

    paper: {
      type: String,
      enum: QUESTION_BANK_PAPER,
    },

    organization: {
      type: String,
      trim: true,
      default: "",
    },

    description: {
      type: String,
      trim: true,
      default: "",
    },

    visibility: {
      type: String,
      enum: QUESTION_BANK_VISIBILITY,
      default: "PUBLIC",
    },

    totalQuestions: {
      type: Number,
      default: 0,
      min: 0,
    },

    isPublished: {
      type: Boolean,
      default: true,
    },

    isPremium: {
      type: Boolean,
      default: false,
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

/* ======================================================
   Indexes
====================================================== */

questionBankSchema.index(
  {
    slug: 1,
  },
  {
    unique: true,
  },
);

questionBankSchema.index({
  category: 1,
  year: -1,
});

questionBankSchema.index({
  category: 1,
  paper: 1,
});

questionBankSchema.index({
  visibility: 1,
  isPublished: 1,
});

questionBankSchema.index({
  title: "text",
  organization: "text",
  description: "text",
});

/* ======================================================
   Static Methods
====================================================== */

questionBankSchema.statics.isSlugExists = async function (slug: string) {
  return this.findOne({
    slug,
    isDeleted: false,
  });
};

/* ======================================================
   Query Middleware
====================================================== */

function excludeDeleted(this: any) {
  this.where({
    isDeleted: false,
  });
}

questionBankSchema.pre("find", excludeDeleted);

questionBankSchema.pre("findOne", excludeDeleted);

questionBankSchema.pre("findOneAndUpdate", excludeDeleted);

/* ======================================================
   Model
====================================================== */

export const QuestionBank = model<IQuestionBank, QuestionBankModel>(
  "QuestionBank",
  questionBankSchema,
);
