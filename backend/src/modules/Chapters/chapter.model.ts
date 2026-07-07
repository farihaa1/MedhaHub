import { Schema, model } from "mongoose";
import { IChapter } from "./chapter.interface";
import { ChapterStatus } from "./chapter.constant";

const chapterSchema = new Schema<IChapter>(
  {
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
      enum: ChapterStatus,
      default: ChapterStatus.Draft,
    },

    totalTopics: {
      type: Number,
      default: 0,
      min: 0,
    },

    totalQuestions: {
      type: Number,
      default: 0,
      min: 0,
    },

    progress: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  },
);

chapterSchema.index(
  {
    subjectId: 1,
    slug: 1,
  },
  {
    unique: true,
  },
);

export const Chapter = model<IChapter>("Chapter", chapterSchema);
