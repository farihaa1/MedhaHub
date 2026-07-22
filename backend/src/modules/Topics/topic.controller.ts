import { Request, Response } from "express";
import { TopicService } from "./topic.service";
import { sendResponse } from "../../utils/sendResponse";
import { Topic } from "./topic.model";

const createTopic = async (req: Request, res: Response) => {
  console.log(req.body);
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

const deleteAllTopic = async () => {
  return await Topic.deleteMany({});
};
const createBulkTopics = async (req: Request, res: Response) => {
  const result = await TopicService.createBulkTopics(req.body);

  sendResponse(res, {
    success: true,
    statusCode: 201,
    message: "Topics created successfully",
    data: result,
  });
};
const moveTopic = async (req: Request, res: Response) => {
  const { chapterId } = req.body;

  const result = await TopicService.moveTopic(req.params.id as string, chapterId);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Topic moved successfully",
    data: result,
  });
};

const mergeTopics = async (req: Request, res: Response) => {
  const { sourceTopicId, targetTopicId } = req.body;

  const result = await TopicService.mergeTopics(sourceTopicId, targetTopicId);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Topics merged successfully",
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
  deleteAllTopic,
  createBulkTopics,
  moveTopic,
  mergeTopics,
};
