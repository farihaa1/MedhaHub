import { Schema, model } from "mongoose";
import { ITopic, TopicStatus } from "./topic.interface";

const topicSchema = new Schema<ITopic>(
  {
    chapter: {
      type: Schema.Types.ObjectId,
      ref: "Chapter",
      required: true,
    },
    subject: {
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
      lowercase: true,
    },

    order: {
      type: Number,
      required: true,
      min: 1,
    },

    status: {
      type: String,
      enum: Object.values(TopicStatus),
      default: TopicStatus.Draft,
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
    chapter: 1,
    slug: 1,
  },
  {
    unique: true,
  },
);

topicSchema.index(
  {
    chapter: 1,
    order: 1,
  },
  {
    unique: true,
  },
);
export const Topic = model<ITopic>("Topic", topicSchema);
