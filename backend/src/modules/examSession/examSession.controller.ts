// modules/examSession/examSession.controller.ts

import { Request, Response } from "express";

import httpStatus from "http-status";

import AppError from "../../error/AppError";

import { catchAsync } from "../../utils/catchAsync";

import { sendResponse } from "../../utils/sendResponse";

import { ExamSessionService } from "./examSession.service";
import { ResultService } from "../Result/result.service";

// ============================================================
// GET SESSION
// ============================================================

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

// ============================================================
// SUBMIT ANSWER
// ============================================================

const submitAnswer = catchAsync(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new AppError(
      httpStatus.UNAUTHORIZED,
      "User authentication required.",
    );
  }

  const result = await ExamSessionService.submitAnswer(
    {
      ...req.body,
      sessionId: req.params.id as string,
    },
    req.user.id,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Answer saved successfully.",
    data: result,
  });
});

// ============================================================
// SUBMIT SESSION
// ============================================================

const submitSession = catchAsync(
  async (req: Request, res: Response) => {
    if (!req.user) {
      throw new AppError(
        httpStatus.UNAUTHORIZED,
        "User authentication required.",
      );
    }

    // ----------------------------------------------------------
    // 1. Submit the exam session
    // ----------------------------------------------------------

    const result =
      await ExamSessionService.submitSession(
        req.params.id as string,
        req.user.id,
      );

    // ----------------------------------------------------------
    // 2. Create / update the result
    // ----------------------------------------------------------

    await ResultService.createResult(
      req.params.id as string,
    );

    // ----------------------------------------------------------
    // 3. Return submitted session
    // ----------------------------------------------------------

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Exam submitted successfully.",
      data: result,
    });
  },
);

export const ExamSessionController = {
  getSession,
  submitAnswer,
  submitSession,
};
