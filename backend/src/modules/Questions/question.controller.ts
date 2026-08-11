import { Request, Response } from "express";
import { QuestionService } from "./question.service";
import { sendResponse } from "../../utils/sendResponse";
import { catchAsync } from "../../utils/catchAsync";
import { UserRole } from "../users/user.constants";
import { QuestionStatus } from "./question.constant";

/* =========================================================
   CREATE QUESTION
========================================================= */

const createQuestion = catchAsync(async (req: Request, res: Response) => {
  const payload = {
    ...req.body,

    createdBy: req.user!.id,

    /*
     * Backend decides status.
     *
     * ADMIN -> APPROVED
     * USER  -> PENDING
     */
    status:
      req.user!.role === UserRole.ADMIN
        ? QuestionStatus.APPROVED
        : QuestionStatus.PENDING,
  };

  const result = await QuestionService.createQuestion(payload, req.user!.role);

  sendResponse(res, {
    success: true,
    statusCode: 201,
    message: "Question created successfully",
    data: result,
  });
});

const bulkCreateQuestions = catchAsync(async (req: Request, res: Response) => {
  const status =
    req.user!.role === UserRole.ADMIN
      ? QuestionStatus.APPROVED
      : QuestionStatus.PENDING;

  const payload = req.body.map((question: Record<string, any>) => ({
    ...question,
    createdBy: req.user!.id,
    status,
  }));

  const result = await QuestionService.bulkCreateQuestions(
    payload,
    req.user!.role,
  );

  sendResponse(res, {
    success: true,
    statusCode: 201,
    message: "Questions created successfully",
    data: result,
  });
});

/* =========================================================
   GET ALL QUESTIONS
========================================================= */

const getAllQuestions = catchAsync(async (req: Request, res: Response) => {
  const result = await QuestionService.getAllQuestions(req.query);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Questions retrieved successfully",
    data: result,
  });
});

/* =========================================================
   GET QUESTIONS BY TOPIC
========================================================= */

const getQuestionsByTopic = catchAsync(async (req: Request, res: Response) => {
  const result = await QuestionService.getQuestionsByTopic(
    req.params.topicId as string,
  );

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Topic questions retrieved",
    data: result,
  });
});

/* =========================================================
   GET SINGLE QUESTION
========================================================= */

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

/* =========================================================
   UPDATE QUESTION
========================================================= */

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

/* =========================================================
   DELETE QUESTION
========================================================= */

const deleteQuestion = catchAsync(async (req: Request, res: Response) => {
  const result = await QuestionService.deleteQuestion(req.params.id as string);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Question deleted",
    data: result,
  });
});

/* =========================================================
   QUESTION STATISTICS
========================================================= */

const getQuestionStats = catchAsync(async (_req: Request, res: Response) => {
  const result = await QuestionService.getQuestionStats();

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Question statistics retrieved successfully",
    data: result,
  });
});


/* =========================================================
   EXPORT
========================================================= */

export const QuestionController = {
  createQuestion,
  getAllQuestions,
  getQuestionsByTopic,
  getSingleQuestion,
  updateQuestion,
  deleteQuestion,
  bulkCreateQuestions,
  getQuestionStats,
 
};
