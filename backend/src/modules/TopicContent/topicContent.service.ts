import mongoose from "mongoose";

import { TopicContent } from "./topicContent.model";

import { ITopicContent, TopicContentStatus } from "./topicContent.interface";

import AppError from "../../error/AppError";

import { Topic } from "../Topics/topic.model";

// =========================================================
// CREATE
// =========================================================

const createTopicContent = async (payload: Omit<ITopicContent, "_id">) => {
  const topicExists = await Topic.exists({
    _id: payload.topicId,
  });

  if (!topicExists) {
    throw new AppError(404, "Topic not found");
  }

  const existingContent = await TopicContent.findOne({
    topicId: payload.topicId,
  });

  if (existingContent) {
    throw new AppError(409, "Content already exists for this topic");
  }

  return await TopicContent.create(payload);
};

// =========================================================
// GET CONTENT BY TOPIC
// =========================================================

const getTopicContent = async (topicId: string) => {
  if (!mongoose.Types.ObjectId.isValid(topicId)) {
    throw new AppError(400, "Invalid topic ID");
  }

  const content = await TopicContent.findOne({
    topicId,
  })
    .populate({
      path: "topicId",

      select: "title slug chapterId subjectId totalQuestions",

      populate: [
        {
          path: "chapterId",

          select: "title slug",
        },

        {
          path: "subjectId",

          select: "title slug",
        },
      ],
    })
    .lean();

  if (!content) {
    throw new AppError(404, "Topic content not found");
  }

  return content;
};

// =========================================================
// GET PUBLISHED
// =========================================================

const getPublishedTopicContent = async (topicId: string) => {
  if (!mongoose.Types.ObjectId.isValid(topicId)) {
    throw new AppError(400, "Invalid topic ID");
  }

  const content = await TopicContent.findOne({
    topicId,

    status: "published",
  })
    .populate({
      path: "topicId",

      select: "title slug chapterId subjectId totalQuestions",

      populate: [
        {
          path: "chapterId",

          select: "title slug",
        },

        {
          path: "subjectId",

          select: "title slug",
        },
      ],
    })
    .lean();

  if (!content) {
    throw new AppError(404, "Published topic content not found");
  }

  return content;
};

// =========================================================
// UPDATE
// =========================================================

const updateTopicContent = async (
  topicId: string,

  payload: Partial<Pick<ITopicContent, "bullets" | "status">>,

  userId?: string,
) => {
  if (!mongoose.Types.ObjectId.isValid(topicId)) {
    throw new AppError(400, "Invalid topic ID");
  }

  const updateData: Record<string, unknown> = {
    ...payload,
  };

  if (userId) {
    updateData.updatedBy = userId;
  }

  const content = await TopicContent.findOneAndUpdate(
    {
      topicId,
    },

    {
      $set: updateData,
    },

    {
      new: true,

      runValidators: true,
    },
  );

  if (!content) {
    throw new AppError(404, "Topic content not found");
  }

  return content;
};

// =========================================================
// UPSERT
// =========================================================

const upsertTopicContent = async (
  topicId: string,

  payload: {
    bullets: string[];

    status?: TopicContentStatus;
  },

  userId?: string,
) => {
  if (!mongoose.Types.ObjectId.isValid(topicId)) {
    throw new AppError(400, "Invalid topic ID");
  }

  const topicExists = await Topic.exists({
    _id: topicId,
  });

  if (!topicExists) {
    throw new AppError(404, "Topic not found");
  }

  const updateData = {
    topicId,

    bullets: payload.bullets,

    ...(payload.status && {
      status: payload.status,
    }),

    ...(userId && {
      updatedBy: userId,
    }),
  };

  return await TopicContent.findOneAndUpdate(
    {
      topicId,
    },

    {
      $set: updateData,

      $setOnInsert: {
        createdBy: userId,
      },
    },

    {
      new: true,

      upsert: true,

      runValidators: true,
    },
  );
};

// =========================================================
// DELETE
// =========================================================

const deleteTopicContent = async (topicId: string) => {
  if (!mongoose.Types.ObjectId.isValid(topicId)) {
    throw new AppError(400, "Invalid topic ID");
  }

  const content = await TopicContent.findOneAndDelete({
    topicId,
  });

  if (!content) {
    throw new AppError(404, "Topic content not found");
  }

  return content;
};

// =========================================================
// EXPORT
// =========================================================

export const TopicContentService = {
  createTopicContent,

  getTopicContent,

  getPublishedTopicContent,

  updateTopicContent,

  upsertTopicContent,

  deleteTopicContent,
};
