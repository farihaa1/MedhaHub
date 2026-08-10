// modules/Result/result.controller.ts

import { Request, Response } from "express";

import httpStatus from "http-status";

import AppError from "../../error/AppError";

import { catchAsync } from "../../utils/catchAsync";

import { sendResponse } from "../../utils/sendResponse";

import { ResultService } from "./result.service";

const getResultReview = catchAsync(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Authentication required.");
  }

  const result = await ResultService.getResultReview(
    req.params.sessionId as string,
    req.user.id,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Result retrieved successfully.",
    data: result,
  });
});

export const ResultController = {
  getResultReview,
};
