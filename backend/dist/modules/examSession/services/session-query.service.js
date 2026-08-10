"use strict";
// modules/examSession/services/session-query.service.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SessionQueryService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../../error/AppError"));
const examSession_model_1 = require("../examSession.model");
const examSession_constant_1 = require("../examSession.constant");
// ============================================================
// GET OWNED SESSION
// ============================================================
const getOwnedSession = async (sessionId, userId) => {
    const session = await examSession_model_1.ExamSession.findOne({
        _id: sessionId,
        userId,
    });
    if (!session) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Exam session not found.");
    }
    return session;
};
// ============================================================
// GET OWNED SESSION WITH QUESTIONS
// ============================================================
const getOwnedSessionWithQuestions = async (sessionId, userId) => {
    const session = await examSession_model_1.ExamSession.findOne({
        _id: sessionId,
        userId,
    });
    if (!session) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Exam session not found.");
    }
    return session;
};
// ============================================================
// GET RUNNING SESSION
// ============================================================
const getRunningSession = async (userId, examType) => {
    const session = await examSession_model_1.ExamSession.findOne({
        userId,
        examType,
        status: examSession_constant_1.ExamSessionStatus.RUNNING,
    });
    return session;
};
// ============================================================
// EXPORT
// ============================================================
exports.SessionQueryService = {
    getOwnedSession,
    getOwnedSessionWithQuestions,
    getRunningSession,
};
//# sourceMappingURL=session-query.service.js.map