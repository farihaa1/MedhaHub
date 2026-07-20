import { Request, Response } from "express";

import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";

import { QuestionSubmissionService } from "./questionSubmission.service";

// CREATE SUBMISSION
const createSubmission = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user!._id;

  const result = await QuestionSubmissionService.createSubmission(
    req.body,
    userId,
  );

  sendResponse(res, {
    success: true,
    statusCode: 201,
    message: "Question submitted successfully",
    data: result,
  });
});

// GET ALL
const getAllSubmissions = catchAsync(async (_req: Request, res: Response) => {
  const result = await QuestionSubmissionService.getAllSubmissions();

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Question submissions retrieved successfully",
    data: result,
  });
});

// GET SINGLE
const getSingleSubmission = catchAsync(async (req: Request, res: Response) => {
  const result = await QuestionSubmissionService.getSingleSubmission(
    req.params.id as string,
  );

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Question submission retrieved successfully",
    data: result,
  });
});

// DELETE
const deleteSubmission = catchAsync(async (req: Request, res: Response) => {
  const result = await QuestionSubmissionService.deleteSubmission(
    req.params.id as string,
  );

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Question submission deleted successfully",
    data: result,
  });
});

// APPROVE
const approve = catchAsync(async (req: Request, res: Response) => {
  const adminId = req.user!._id;

  const result = await QuestionSubmissionService.approveSubmission(
    req.params.id as string,
    adminId,
    req.body.reviewComment,
  );

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Question approved successfully",
    data: result,
  });
});

// REJECT
const reject = catchAsync(async (req: Request, res: Response) => {
  const adminId = req.user!._id;

  const result = await QuestionSubmissionService.rejectSubmission(
    req.params.id as string,
    adminId,
    req.body.reviewComment,
  );

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Question rejected successfully",
    data: result,
  });
});

export const QuestionSubmissionController = {
  createSubmission,

  getAllSubmissions,

  getSingleSubmission,

  deleteSubmission,

  approve,

  reject,
};
