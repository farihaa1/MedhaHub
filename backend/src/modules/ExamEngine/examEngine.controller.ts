import { Request, Response } from "express";
import httpStatus from "http-status";

import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";


import { ExamEngineService } from "./examEngine.service";
import AppError from "../../error/AppError";

const startExam = catchAsync(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new AppError(
      httpStatus.UNAUTHORIZED,
      "User authentication required.",
    );
  }

  const userId = req.user._id as string;

  const result = await ExamEngineService.startExam({
    ...req.body,
    userId,
  });

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
