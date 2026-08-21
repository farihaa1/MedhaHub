import { Request, Response } from "express";

import { TopicContentService } from "./topicContent.service";

import { sendResponse } from "../../utils/sendResponse";
import { catchAsync } from "../../utils/catchAsync";

// =========================================================
// CREATE
// =========================================================

const createTopicContent = catchAsync(async (req: Request, res: Response) => {
  const payload = {
    ...req.body,
    createdBy: req.user?.id,
  };

  const result = await TopicContentService.createTopicContent(payload);

  sendResponse(res, {
    success: true,
    statusCode: 201,
    message: "Topic content created successfully",
    data: result,
  });
});

// =========================================================
// GET ALL CONTENT
// =========================================================

const getTopicContent = catchAsync(async (req: Request, res: Response) => {
  const result = await TopicContentService.getTopicContent(
    req.params.topicId as string,
  );

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Topic content retrieved successfully",
    data: result,
  });
});

// =========================================================
// GET PUBLISHED CONTENT
// =========================================================

const getPublishedTopicContent = catchAsync(
  async (req: Request, res: Response) => {
    const result = await TopicContentService.getPublishedTopicContent(
      req.params.topicId as string,
    );

    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "Topic content retrieved successfully",
      data: result,
    });
  },
);

// =========================================================
// UPDATE
// =========================================================

const updateTopicContent = catchAsync(async (req: Request, res: Response) => {
  const result = await TopicContentService.updateTopicContent(
    req.params.topicId as string,
    req.body,
    req.user?.id,
  );

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Topic content updated successfully",
    data: result,
  });
});

// =========================================================
// UPSERT
// =========================================================

const upsertTopicContent = catchAsync(async (req: Request, res: Response) => {
  const result = await TopicContentService.upsertTopicContent(
    req.params.topicId as string,
    req.body,
    req.user?.id,
  );

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Topic content saved successfully",
    data: result,
  });
});

// =========================================================
// DELETE
// =========================================================

const deleteTopicContent = catchAsync(async (req: Request, res: Response) => {
  const result = await TopicContentService.deleteTopicContent(
    req.params.topicId as string,
  );

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Topic content deleted successfully",
    data: result,
  });
});

// =========================================================
// EXPORT
// =========================================================

export const TopicContentController = {
  createTopicContent,
  getTopicContent,
  getPublishedTopicContent,
  updateTopicContent,
  upsertTopicContent,
  deleteTopicContent,
};
