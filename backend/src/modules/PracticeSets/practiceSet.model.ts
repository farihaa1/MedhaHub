import { HydratedDocument, Schema, model } from "mongoose";
import { IPracticeSet } from "./practiceSet.interface";
import {
  PracticeSetStatus,
  PracticeSetVisibility,
} from "./practiceSet.constant";
import { generateSlug } from "./practiceSet.utils";

const practiceSetSchema = new Schema<IPracticeSet>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },

    slug: {
      type: String,
      unique: true,
      index: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
    },

    subject: {
      type: Schema.Types.ObjectId,
      ref: "Subject",
      required: true,
    },

    chapter: {
      type: Schema.Types.ObjectId,
      ref: "Chapter",
    },

    topics: [
      {
        type: Schema.Types.ObjectId,
        ref: "Topic",
      },
    ],

    questions: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: "Question",
        },
      ],
      required: true,
      validate: {
        validator: (value: Schema.Types.ObjectId[]) => value.length > 0,
        message: "Practice set must contain at least one question.",
      },
    },

    settings: {
      duration: {
        type: Number,
        min: 1,
      },

      negativeMark: {
        type: Number,
        default: 0,
        min: 0,
      },

      shuffleQuestions: {
        type: Boolean,
        default: true,
      },

      shuffleOptions: {
        type: Boolean,
        default: true,
      },
    },

    visibility: {
      type: String,
      enum: Object.values(PracticeSetVisibility),
      default: PracticeSetVisibility.PUBLIC,
    },

    isPremium: {
      type: Boolean,
      default: false,
    },

    status: {
      type: String,
      enum: Object.values(PracticeSetStatus),
      default: PracticeSetStatus.DRAFT,
    },

    tags: [
      {
        type: String,
        trim: true,
      },
    ],

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
    versionKey: false,
  },
);

/* ---------------------------------
   Indexes
---------------------------------- */

practiceSetSchema.index({ subject: 1 });
practiceSetSchema.index({ chapter: 1 });
practiceSetSchema.index({ topics: 1 });
practiceSetSchema.index({ status: 1 });
practiceSetSchema.index({ visibility: 1 });
practiceSetSchema.index({ isPremium: 1 });

/* ---------------------------------
   Middleware
---------------------------------- */

practiceSetSchema.pre(
  "validate",
  function (this: HydratedDocument<IPracticeSet>) {
    if (!this.slug && this.title) {
      this.slug = generateSlug(this.title);
    }
  },
);

export const PracticeSet = model<IPracticeSet>(
  "PracticeSet",
  practiceSetSchema,
);
