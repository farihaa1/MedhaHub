"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuestionBankItemController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const questionBankItem_service_1 = require("./questionBankItem.service");
const catchAsync_1 = require("../../utils/catchAsync");
const sendResponse_1 = require("../../utils/sendResponse");
/**
 * Add Single Question
 */
const addQuestionToBank = (0, catchAsync_1.catchAsync)(async (req, res) => {
    console.log("add questionbank ", req.params);
    const questionBankId = req.params.questionBankId;
    const result = await questionBankItem_service_1.QuestionBankItemService.addQuestionToBank(questionBankId, req.body, req.user);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_1.default.CREATED,
        message: "Question added successfully",
        data: result,
    });
});
/**
 * Bulk Add Questions
 */
const bulkAddQuestions = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { questionBankId } = req.params;
    const { questionIds } = req.body;
    const result = await questionBankItem_service_1.QuestionBankItemService.bulkAddQuestions(questionBankId, questionIds, req.user);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_1.default.CREATED,
        message: "Questions added successfully",
        data: result,
    });
});
/**
 * Get Questions of a Bank
 */
const getQuestionsByBank = (0, catchAsync_1.catchAsync)(async (req, res) => {
    console.log("get questionbank ", req.params);
    const { questionBankId } = req.params;
    const result = await questionBankItem_service_1.QuestionBankItemService.getQuestionsByBank(questionBankId, req.query);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Questions retrieved successfully",
        data: result,
    });
});
/**
 * Remove Question
 */
const removeQuestionFromBank = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const questionBankId = req.params.questionBankId;
    const questionId = req.params.questionId;
    await questionBankItem_service_1.QuestionBankItemService.removeQuestionFromBank(questionBankId, questionId);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Question removed successfully",
        data: null,
    });
});
/**
 * Reorder Questions
 */
const reorderQuestions = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { questionBankId } = req.params;
    await questionBankItem_service_1.QuestionBankItemService.reorderQuestions(questionBankId, req.body.items);
    const result = await questionBankItem_service_1.QuestionBankItemService.reorderQuestions(questionBankId, req.body.items);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Questions reordered successfully",
        data: result,
    });
});
/**
 * Update QuestionBankItem
 */
const updateQuestionBankItem = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    const result = await questionBankItem_service_1.QuestionBankItemService.updateQuestionBankItem(id, req.body, req.user);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Question updated successfully",
        data: result,
    });
});
exports.QuestionBankItemController = {
    addQuestionToBank,
    bulkAddQuestions,
    getQuestionsByBank,
    removeQuestionFromBank,
    reorderQuestions,
    updateQuestionBankItem,
};
//# sourceMappingURL=questionBankItem.controller.js.map