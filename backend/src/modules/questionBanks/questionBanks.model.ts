import { Schema, model } from "mongoose";

import {
  QUESTION_BANKS_CATEGORY,
  QUESTION_BANKS_PAPER,
  QUESTION_BANKS_STATUS,
  QuestionBanksStatus,
  QuestionBanksVisibility,
} from "./questionBanks.constant";

import { IQuestionBanks, QuestionBanksModel } from "./questionBanks.interface";

const questionBanksSchema = new Schema<IQuestionBanks, QuestionBanksModel>(
  {
    /* ==========================================================
       Basic Information
    ========================================================== */

    title: {
      type: String,
      required: [true, "Question bank title is required"],
      trim: true,
      minlength: 3,
      maxlength: 200,
    },

    description: {
      type: String,
      trim: true,
      default: "",
      maxlength: 2000,
    },

    slug: {
      type: String,
      trim: true,
      lowercase: true,
      default: null,
    },

    category: {
      type: String,
      enum: QUESTION_BANKS_CATEGORY,
      required: true,
      index: true,
    },

    organization: {
      type: String,
      trim: true,
      default: "",
    },

    year: {
      type: Number,
      min: 1900,
      max: 2100,
      index: true,
    },

    paper: {
      type: String,
      enum: QUESTION_BANKS_PAPER,
      index: true,
    },

    visibility: {
      type: String,
      enum: Object.values(QuestionBanksVisibility),
      default: QuestionBanksVisibility.PUBLIC,
      index: true,
    },

    /* ==========================================================
       Statistics
    ========================================================== */

    totalQuestions: {
      type: Number,
      default: 0,
      min: 0,
    },

    isPremium: {
      type: Boolean,
      default: false,
      index: true,
    },

    /* ==========================================================
       Workflow
    ========================================================== */

    status: {
      type: String,
      enum: QUESTION_BANKS_STATUS,
      default: QuestionBanksStatus.REVIEW,
      index: true,
    },

    reviewRemark: {
      type: String,
      trim: true,
      default: "",
      maxlength: 1000,
    },

    approvedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    approvedAt: {
      type: Date,
      default: null,
    },

    publishedAt: {
      type: Date,
      default: null,
    },

    /* ==========================================================
       Soft Delete
    ========================================================== */

    isDeleted: {
      type: Boolean,
      default: false,
      index: true,
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

    restoredAt: {
      type: Date,
      default: null,
    },

    restoredBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    /* ==========================================================
       Audit
    ========================================================== */

    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);
/* ==========================================================
   Compound Indexes
========================================================== */

questionBanksSchema.index({
  category: 1,
  year: -1,
});

questionBanksSchema.index({
  category: 1,
  paper: 1,
});

questionBanksSchema.index({
  category: 1,
  status: 1,
});

questionBanksSchema.index({
  category: 1,
  status: 1,
  year: -1,
});

questionBanksSchema.index({
  category: 1,
  organization: 1,
});

questionBanksSchema.index({
  status: 1,
  year: -1,
});

questionBanksSchema.index({
  isPremium: 1,
  status: 1,
});

questionBanksSchema.index({
  createdBy: 1,
  createdAt: -1,
});

/* ==========================================================
   Slug Index

   Multiple null values are allowed.
   Only actual string slugs must be unique.
========================================================== */

questionBanksSchema.index(
  {
    slug: 1,
  },
  {
    unique: true,
    partialFilterExpression: {
      slug: {
        $type: "string",
      },
    },
  },
);

/* ==========================================================
   Text Search
========================================================== */

questionBanksSchema.index({
  title: "text",
  organization: "text",
  description: "text",
});

/* ==========================================================
   Static Methods
========================================================== */

questionBanksSchema.statics.isSlugExists = function (slug: string) {
  return this.findOne({
    slug: slug.trim().toLowerCase(),
    isDeleted: false,
  });
};

questionBanksSchema.statics.countPublished = function () {
  return this.countDocuments({
    status: QuestionBanksStatus.PUBLISHED,
    isDeleted: false,
  });
};

/* ==========================================================
   Query Middleware

   Automatically hide soft deleted records.
========================================================== */

function excludeDeleted(this: any) {
  this.where({
    isDeleted: false,
  });
}

questionBanksSchema.pre("find", excludeDeleted);
questionBanksSchema.pre("findOne", excludeDeleted);
questionBanksSchema.pre("findOneAndUpdate", excludeDeleted);
questionBanksSchema.pre("countDocuments", excludeDeleted);

/* ==========================================================
   Model Export
========================================================== */

export const QuestionBanks = model<
  IQuestionBanks,
  QuestionBanksModel
>(
  "QuestionBanks",
  questionBanksSchema,
);
