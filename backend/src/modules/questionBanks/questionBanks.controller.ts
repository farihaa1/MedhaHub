import httpStatus from "http-status";

import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";

import { QuestionBanksService } from "./questionBanks.service";
import { StringExpressionOperatorReturningArray } from "mongoose";

/* ============================================================
   Create
============================================================ */

const createQuestionBanks = catchAsync(async (req, res) => {
  const result = await QuestionBanksService.createQuestionBanks(
    req.body,
    req.user!,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message:
      result.status === "REVIEW"
        ? "Question bank submitted for review."
        : "Question bank created successfully.",
    data: result,
  });
});

/* ============================================================
   Bulk Create
============================================================ */

const bulkCreateQuestionBanks = catchAsync(async (req, res) => {
  const result = await QuestionBanksService.bulkCreateQuestionBanks(
    req.body,
    req.user!,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: `${result.length} question banks created successfully.`,
    data: result,
  });
});

/* ============================================================
   Get All
============================================================ */

const getAllQuestionBanks = catchAsync(async (req, res) => {
  const result = await QuestionBanksService.getAllQuestionBanks(req.query);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Question banks retrieved successfully.",
    data: result,
  });
});

/* ============================================================
   Get Single
============================================================ */

const getSingleQuestionBanks = catchAsync(async (req, res) => {
  const result = await QuestionBanksService.getSingleQuestionBanks(
    req.params.identifier as string,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Question bank retrieved successfully.",
    data: result,
  });
});

/* ============================================================
   Update
============================================================ */

const updateQuestionBanks = catchAsync(async (req, res) => {
  const result = await QuestionBanksService.updateQuestionBanks(
    req.params.id as string,
    req.body,
    req.user!,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Question bank updated successfully.",
    data: result,
  });
});

/* ============================================================
   Publish
============================================================ */

const publishQuestionBanks = catchAsync(async (req, res) => {
  const result = await QuestionBanksService.publishQuestionBanks(
    req.params.id as string,
    req.body,
    req.user!,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Question bank published successfully.",
    data: result,
  });
});

/* ============================================================
   Reject
============================================================ */

const rejectQuestionBanks = catchAsync(async (req, res) => {
  const result = await QuestionBanksService.rejectQuestionBanks(
    req.params.id as string,
    req.body,
    req.user!,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Question bank rejected successfully.",
    data: result,
  });
});

/* ============================================================
   Archive
============================================================ */

const archiveQuestionBanks = catchAsync(async (req, res) => {
  const result = await QuestionBanksService.archiveQuestionBanks(
    req.params.id as string,
    req.user!,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Question bank archived successfully.",
    data: result,
  });
});

/* ============================================================
   Restore
============================================================ */

const restoreQuestionBanks = catchAsync(async (req, res) => {
  const result = await QuestionBanksService.restoreQuestionBanks(
    req.params.id as string,
    req.user!,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Question bank restored successfully.",
    data: result,
  });
});

/* ============================================================
   Delete
============================================================ */

const deleteQuestionBanks = catchAsync(async (req, res) => {
  await QuestionBanksService.deleteQuestionBanks(req.params.id as string, req.user!);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Question bank deleted successfully.",
    data: null,
  });
});

const importQuestions = catchAsync(async (req, res) => {
  const result = await QuestionBanksService.importQuestions(
    req.params.id as string,
    req.body.questions,
    req.user!,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Questions imported successfully.",
    data: result,
  });
});


/* ============================================================
   Export
============================================================ */

export const QuestionBanksController = {
  createQuestionBanks,
  bulkCreateQuestionBanks,

  getAllQuestionBanks,
  getSingleQuestionBanks,

  updateQuestionBanks,

  publishQuestionBanks,
  rejectQuestionBanks,

  archiveQuestionBanks,
  restoreQuestionBanks,

  deleteQuestionBanks,

  importQuestions,
};
