import { Request, Response } from "express";

import httpStatus from "http-status";

import { catchAsync } from "../../utils/catchAsync";

import { sendResponse } from "../../utils/sendResponse";

import { ExamSessionService } from "./examSession.service";

const getSession = catchAsync(async (req: Request, res: Response) => {
  const result = await ExamSessionService.getSessionById(req.params.id as string);

  sendResponse(res, {
    success: true,

    statusCode: httpStatus.OK,

    message: "Exam session retrieved",

    data: result,
  });
});

const submitSession = catchAsync(async (req: Request, res: Response) => {
  const result = await ExamSessionService.submitSession(req.params.id as string);

  sendResponse(res, {
    success: true,

    statusCode: httpStatus.OK,

    message: "Exam submitted successfully",

    data: result,
  });
});

export const ExamSessionController = {
  getSession,

  submitSession,
};
