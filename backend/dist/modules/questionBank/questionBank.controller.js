"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuestionBankController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const questionBank_service_1 = require("./questionBank.service");
const catchAsync_1 = require("../../utils/catchAsync");
const sendResponse_1 = require("../../utils/sendResponse");
/* ======================================================
   Create
====================================================== */
const createQuestionBank = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await questionBank_service_1.QuestionBankService.createQuestionBank(req.body, req.user);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_1.default.CREATED,
        message: "Question Bank created successfully",
        data: result,
    });
});
/* ======================================================
   Get All
====================================================== */
const getAllQuestionBanks = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await questionBank_service_1.QuestionBankService.getAllQuestionBanks(req.query);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Question Banks retrieved successfully",
        data: result,
    });
});
/* ======================================================
   Get Single
====================================================== */
const getSingleQuestionBank = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const result = await questionBank_service_1.QuestionBankService.getSingleQuestionBank(id);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Question Bank retrieved successfully",
        data: result,
    });
});
/* ======================================================
   Update
====================================================== */
const updateQuestionBank = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const result = await questionBank_service_1.QuestionBankService.updateQuestionBank(id, req.body, req.user);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Question Bank updated successfully",
        data: result,
    });
});
/* ======================================================
   Delete
====================================================== */
const deleteQuestionBank = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    await questionBank_service_1.QuestionBankService.deleteQuestionBank(id, req.user);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Question Bank deleted successfully",
        data: null,
    });
});
/* ======================================================
   Export
====================================================== */
exports.QuestionBankController = {
    createQuestionBank,
    getAllQuestionBanks,
    getSingleQuestionBank,
    updateQuestionBank,
    deleteQuestionBank,
};
//# sourceMappingURL=questionBank.controller.js.map