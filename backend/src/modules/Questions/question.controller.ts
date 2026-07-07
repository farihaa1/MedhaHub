import { Request, Response } from "express";
import { QuestionService } from "./question.service";
import { sendResponse } from "../../utils/sendResponse";
import { catchAsync } from "../../utils/catchAsync";

const createQuestion = catchAsync(async (req: Request, res: Response) => {
  const result = await QuestionService.createQuestion(req.body);

  sendResponse(res, {
    success: true,
    statusCode: 201,
    message: "Question created successfully",
    data: result,
  });
});

const getAllQuestions = catchAsync(async (req: Request, res: Response) => {
  const result = await QuestionService.getAllQuestions();

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Questions retrieved successfully",
    data: result,
  });
});

const getQuestionsByTopic = catchAsync(async (req: Request, res: Response) => {
  const result = await QuestionService.getQuestionsByTopic(req.params.topicId as string);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Topic questions retrieved",
    data: result,
  });
});

const getSingleQuestion = catchAsync(async (req: Request, res: Response) => {
  const result = await QuestionService.getSingleQuestion(
    req.params.id as string,
  );

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Question retrieved",
    data: result,
  });
});

const updateQuestion = catchAsync(async (req: Request, res: Response) => {
  const result = await QuestionService.updateQuestion(
    req.params.id as string,
    req.body,
  );

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Question updated",
    data: result,
  });
});

const deleteQuestion = catchAsync(async (req: Request, res: Response) => {
  const result = await QuestionService.deleteQuestion(req.params.id as string);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Question deleted",
    data: result,
  });
});

export const QuestionController = {
  createQuestion,
  getAllQuestions,
  getQuestionsByTopic,
  getSingleQuestion,
  updateQuestion,
  deleteQuestion,
};
