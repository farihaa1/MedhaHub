import httpStatus from "http-status";
import { Request } from "express";
import { QuestionBankItemService } from "./questionBankItem.service";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";

/**
 * Add Single Question
 */
const addQuestionToBank = catchAsync(
  async (req, res) => {
    console.log("add questionbank ",req.params)
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const result = await QuestionBankItemService.addQuestionToBank(
      id,
      req.body,
      req.user!,
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Question added successfully",
      data: result,
    });
  },
);

/**
 * Bulk Add Questions
 */
const bulkAddQuestions = catchAsync(async (req, res) => {
    console.log("bulk add questionbank ", req.params);
 const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

  const { questionIds } = req.body;

  const result = await QuestionBankItemService.bulkAddQuestions(
    id,
    questionIds,
    req.user!,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Questions added successfully",
    data: result,
  });
});

/**
 * Get Questions of a Bank
 */
const getQuestionsByBank = catchAsync(async (req, res) => {
    console.log("get questionbank ", req.params);
 const {questionBankId} = req.params

  const result = await QuestionBankItemService.getQuestionsByBank(
    questionBankId as string,
    req.query,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Questions retrieved successfully",
    data: result,
  });
});

/**
 * Remove Question
 */
const removeQuestionFromBank = catchAsync(async (req, res) => {
    const questionBankId = req.params.questionBankId as string;
  const questionId = req.params.questionId as string;

  await QuestionBankItemService.removeQuestionFromBank(questionBankId, questionId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Question removed successfully",
    data: null,
  });
});

/**
 * Reorder Questions
 */
const reorderQuestions = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await QuestionBankItemService.reorderQuestions(
    id as string,
    req.body.items,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Questions reordered successfully",
    data: result,
  });
});

/**
 * Update QuestionBankItem
 */
const updateQuestionBankItem = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await QuestionBankItemService.updateQuestionBankItem(
    id as string,
    req.body,
    req.user!,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Question updated successfully",
    data: result,
  });
});

export const QuestionBankItemController = {
  addQuestionToBank,
  bulkAddQuestions,
  getQuestionsByBank,
  removeQuestionFromBank,
  reorderQuestions,
  updateQuestionBankItem,
};
