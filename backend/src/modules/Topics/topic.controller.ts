import { Request, Response } from "express";
import { TopicService } from "./topic.service";
import { sendResponse } from "../../utils/sendResponse";

const createTopic = async (req: Request, res: Response) => {
  const result = await TopicService.createTopic(req.body);

  sendResponse(res, {
    success: true,
    statusCode: 201,
    message: "Topic created successfully",
    data: result,
  });
};

const getAllTopics = async (_req: Request, res: Response) => {
  const result = await TopicService.getAllTopics();

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Topics retrieved successfully",
    data: result,
  });
};

const getSingleTopic = async (req: Request, res: Response) => {
  const result = await TopicService.getSingleTopic(req.params.id as string);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Topic retrieved successfully",
    data: result,
  });
};

const getTopicsByChapter = async (req: Request, res: Response) => {
  const result = await TopicService.getTopicsByChapter(
    req.params.chapterId as string,
  );

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Topics retrieved successfully",
    data: result,
  });
};

const updateTopic = async (req: Request, res: Response) => {
  const result = await TopicService.updateTopic(
    req.params.id as string,
    req.body,
  );

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Topic updated successfully",
    data: result,
  });
};

const deleteTopic = async (req: Request, res: Response) => {
  const result = await TopicService.deleteTopic(req.params.id as string);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Topic deleted successfully",
    data: result,
  });
};

export const TopicController = {
  createTopic,
  getAllTopics,
  getSingleTopic,
  getTopicsByChapter,
  updateTopic,
  deleteTopic,
};
