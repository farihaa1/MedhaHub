import httpStatus from "http-status";
import { Request, Response } from "express";

import AppError from "../../error/AppError";

import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";

import { ExamEngineService } from "./examEngine.service";

const startExam = catchAsync(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Authentication required.");
  }

  const result = await ExamEngineService.startExam({
    ...req.body,

    userId: req.user._id as string,
  });
  console.log("result,result")

  sendResponse(res, {
    success: true,

    statusCode: httpStatus.CREATED,

    message: "Exam started successfully.",

    data: result,
  });
});

export const ExamEngineController = {
  startExam,
};
