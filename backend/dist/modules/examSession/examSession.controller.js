"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExamSessionController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../error/AppError"));
const catchAsync_1 = require("../../utils/catchAsync");
const sendResponse_1 = require("../../utils/sendResponse");
const examSession_service_1 = require("./examSession.service");
const getSession = (0, catchAsync_1.catchAsync)(async (req, res) => {
    if (!req.user) {
        throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, "User authentication required.");
    }
    const result = await examSession_service_1.ExamSessionService.getSessionById(req.params.id, req.user.id);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Exam session retrieved successfully.",
        data: result,
    });
});
const submitSession = (0, catchAsync_1.catchAsync)(async (req, res) => {
    if (!req.user) {
        throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, "User authentication required.");
    }
    const result = await examSession_service_1.ExamSessionService.submitSession(req.params.id, req.user.id);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Exam submitted successfully.",
        data: result,
    });
});
const submitAnswer = (0, catchAsync_1.catchAsync)(async (req, res) => {
    if (!req.user) {
        throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, "Authentication required");
    }
    const result = await examSession_service_1.ExamSessionService.submitAnswer({
        ...req.body,
        sessionId: req.params.id,
    }, req.user.id);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Answer saved successfully.",
        data: result,
    });
});
exports.ExamSessionController = {
    getSession,
    submitAnswer,
    submitSession,
};
//# sourceMappingURL=examSession.controller.js.map