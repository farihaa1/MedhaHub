"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SessionQueryService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../../error/AppError"));
const examSession_model_1 = require("../examSession.model");
const examSession_constant_1 = require("../examSession.constant");
const getSessionById = async (sessionId) => {
    const session = await examSession_model_1.ExamSession.findById(sessionId);
    if (!session) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Exam session not found");
    }
    return session;
};
const getOwnedSession = async (sessionId, userId) => {
    const session = await getSessionById(sessionId);
    if (session.userId.toString() !== userId) {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, "Access denied");
    }
    return session;
};
const getOwnedSessionWithQuestions = async (sessionId, userId) => {
    const session = await examSession_model_1.ExamSession.findById(sessionId).populate("questions.questionId");
    if (!session) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Exam session not found");
    }
    if (session.userId.toString() !== userId) {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, "Access denied");
    }
    return session;
};
const getRunningSession = async (userId, examType) => {
    return examSession_model_1.ExamSession.findOne({
        userId,
        examType,
        status: examSession_constant_1.ExamSessionStatus.RUNNING,
    }).sort({
        createdAt: -1,
    });
};
exports.SessionQueryService = {
    getSessionById,
    getOwnedSession,
    getOwnedSessionWithQuestions,
    getRunningSession,
};
//# sourceMappingURL=session-query.service.js.map