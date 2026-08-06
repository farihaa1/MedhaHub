"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuestionBanksController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = require("../../utils/catchAsync");
const sendResponse_1 = require("../../utils/sendResponse");
const questionBanks_service_1 = require("./questionBanks.service");
/* ============================================================
   Create
============================================================ */
const createQuestionBanks = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await questionBanks_service_1.QuestionBanksService.createQuestionBanks(req.body, req.user);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_1.default.CREATED,
        message: result.status === "REVIEW"
            ? "Question bank submitted for review."
            : "Question bank created successfully.",
        data: result,
    });
});
/* ============================================================
   Bulk Create
============================================================ */
const bulkCreateQuestionBanks = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await questionBanks_service_1.QuestionBanksService.bulkCreateQuestionBanks(req.body, req.user);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_1.default.CREATED,
        message: `${result.length} question banks created successfully.`,
        data: result,
    });
});
/* ============================================================
   Get All
============================================================ */
const getAllQuestionBanks = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await questionBanks_service_1.QuestionBanksService.getAllQuestionBanks(req.query);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Question banks retrieved successfully.",
        data: result,
    });
});
/* ============================================================
   Get Single
============================================================ */
const getSingleQuestionBanks = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await questionBanks_service_1.QuestionBanksService.getSingleQuestionBanks(req.params.identifier);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Question bank retrieved successfully.",
        data: result,
    });
});
/* ============================================================
   Update
============================================================ */
const updateQuestionBanks = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await questionBanks_service_1.QuestionBanksService.updateQuestionBanks(req.params.id, req.body, req.user);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Question bank updated successfully.",
        data: result,
    });
});
/* ============================================================
   Publish
============================================================ */
const publishQuestionBanks = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await questionBanks_service_1.QuestionBanksService.publishQuestionBanks(req.params.id, req.body, req.user);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Question bank published successfully.",
        data: result,
    });
});
/* ============================================================
   Reject
============================================================ */
const rejectQuestionBanks = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await questionBanks_service_1.QuestionBanksService.rejectQuestionBanks(req.params.id, req.body, req.user);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Question bank rejected successfully.",
        data: result,
    });
});
/* ============================================================
   Archive
============================================================ */
const archiveQuestionBanks = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await questionBanks_service_1.QuestionBanksService.archiveQuestionBanks(req.params.id, req.user);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Question bank archived successfully.",
        data: result,
    });
});
/* ============================================================
   Restore
============================================================ */
const restoreQuestionBanks = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await questionBanks_service_1.QuestionBanksService.restoreQuestionBanks(req.params.id, req.user);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Question bank restored successfully.",
        data: result,
    });
});
/* ============================================================
   Delete
============================================================ */
const deleteQuestionBanks = (0, catchAsync_1.catchAsync)(async (req, res) => {
    await questionBanks_service_1.QuestionBanksService.deleteQuestionBanks(req.params.id, req.user);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Question bank deleted successfully.",
        data: null,
    });
});
const importQuestions = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await questionBanks_service_1.QuestionBanksService.importQuestions(req.params.id, req.body.questions, req.user);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_1.default.CREATED,
        message: "Questions imported successfully.",
        data: result,
    });
});
/* ============================================================
   Export
============================================================ */
exports.QuestionBanksController = {
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
//# sourceMappingURL=questionBanks.controller.js.map