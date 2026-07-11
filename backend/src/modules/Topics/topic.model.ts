import { Schema, model } from "mongoose";
import { ITopic } from "./topic.interface";

const topicSchema = new Schema<ITopic>(
  {
    chapterId: {
      type: Schema.Types.ObjectId,
      ref: "Chapter",
      required: true,
    },
    subjectId: {
      type: Schema.Types.ObjectId,
      ref: "Subject",
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      required: true,
      trim: true,
    },

    order: {
      type: Number,
      required: true,
      min: 1,
    },

    status: {
      type: String,
      enum: ["draft", "approved"],
      default: "draft",
    },

    totalQuestions: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

topicSchema.index(
  {
    chapterId: 1,
    slug: 1,
  },
  {
    unique: true,
  },
);

export const Topic = model<ITopic>("Topic", topicSchema);
