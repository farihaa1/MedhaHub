import httpStatus from "http-status";

import { QuestionBankService } from "./questionBank.service";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";

const createQuestionBank = catchAsync(async (req, res) => {
 
  const result = await QuestionBankService.createQuestionBank(
    req.body,
    req.user!,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Question Bank created successfully",
    data: result,
  });
});

const getAllQuestionBanks = catchAsync(async (req, res) => {
  const result = await QuestionBankService.getAllQuestionBanks(req.query);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Question Banks retrieved successfully",
    data: result,
  });
});

const getSingleQuestionBank = catchAsync(async (req, res) => {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

  const result = await QuestionBankService.getSingleQuestionBank(id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Question Bank retrieved successfully",
    data: result,
  });
});

const updateQuestionBank = catchAsync(async (req, res) => {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

  const result = await QuestionBankService.updateQuestionBank(
    id,
    req.body,
    req.user!,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Question Bank updated successfully",
    data: result,
  });
});

const deleteQuestionBank = catchAsync(async (req, res) => {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

  const result = await QuestionBankService.deleteQuestionBank(id, req.user!);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Question Bank deleted successfully",
    data: result,
  });
});
export const QuestionBankController = {
  createQuestionBank,
  getAllQuestionBanks,
  getSingleQuestionBank,
  updateQuestionBank,
  deleteQuestionBank,
};
