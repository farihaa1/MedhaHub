import { Request, Response } from "express";
import httpStatus from "http-status";

import AppError from "../../error/AppError";

import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";

import { ExamSessionService } from "./examSession.service";

const getSession = catchAsync(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new AppError(
      httpStatus.UNAUTHORIZED,
      "User authentication required.",
    );
  }
  const result = await ExamSessionService.getSessionById(
    req.params.id as string,
    req.user.id,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Exam session retrieved successfully.",
    data: result,
  });
});

const submitSession = catchAsync(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new AppError(
      httpStatus.UNAUTHORIZED,
      "User authentication required.",
    );
  }

  const result = await ExamSessionService.submitSession(
    req.params.id as string,
    req.user.id,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Exam submitted successfully.",
    data: result,
  });
});
const submitAnswer = catchAsync(async (req, res) => {
  if (!req.user) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Authentication required");
  }

  const result = await ExamSessionService.submitAnswer(
    {
      ...req.body,
      sessionId: req.params.id,
    },
    req.user.id ,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Answer saved successfully.",
    data: result,
  });
});
export const ExamSessionController = {
  getSession,
  submitAnswer,
  submitSession,
};
