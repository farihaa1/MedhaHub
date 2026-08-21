import { Schema, model } from "mongoose";

import { ITopicContent, TopicContentStatus } from "./topicContent.interface";

const topicContentSchema = new Schema<ITopicContent>(
  {
    topicId: {
      type: Schema.Types.ObjectId,
      ref: "Topic",
      required: true,
      unique: true,
      index: true,
    },

    bullets: {
      type: [String],
      required: true,
      default: [],
      validate: {
        validator: (value: string[]) => value.length > 0,
        message: "At least one bullet point is required.",
      },
    },

    status: {
      type: String,
      enum: ["draft", "published"] as TopicContentStatus[],
      default: "draft",
    },

    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
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

export const TopicContent = model<ITopicContent>(
  "TopicContent",
  topicContentSchema,
);
