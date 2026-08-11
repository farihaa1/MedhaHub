"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SessionQueryService = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../../error/AppError"));
const examSession_model_1 = require("../examSession.model");
// ============================================================
// GET OWNED SESSION
// ============================================================
const getOwnedSession = async (sessionId, userId) => {
    if (!mongoose_1.default.Types.ObjectId.isValid(sessionId)) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Invalid exam session ID.");
    }
    const session = await examSession_model_1.ExamSession.findOne({
        _id: sessionId,
        userId: new mongoose_1.default.Types.ObjectId(userId),
    });
    if (!session) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Exam session not found.");
    }
    return session;
};
// ============================================================
// GET SESSION WITH QUESTIONS
// ============================================================
const getOwnedSessionWithQuestions = async (sessionId, userId) => {
    if (!mongoose_1.default.Types.ObjectId.isValid(sessionId)) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Invalid exam session ID.");
    }
    const session = await examSession_model_1.ExamSession.findOne({
        _id: sessionId,
        userId: new mongoose_1.default.Types.ObjectId(userId),
    }).populate({
        path: "questions.questionId",
        model: "Question",
    });
    if (!session) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Exam session not found.");
    }
    return session;
};
// ============================================================
// GET ACTIVE SESSION
// ============================================================
/**
 * An active session is one that:
 *
 * 1. belongs to the user
 * 2. matches the exam type
 * 3. has not been submitted
 * 4. has not been ended
 */
const getActiveSession = async (userId, examType) => {
    const session = await examSession_model_1.ExamSession.findOne({
        userId: new mongoose_1.default.Types.ObjectId(userId),
        examType,
        submittedAt: {
            $exists: false,
        },
        endTime: {
            $exists: false,
        },
    }).sort({
        createdAt: -1,
    });
    return session;
};
exports.SessionQueryService = {
    getOwnedSession,
    getOwnedSessionWithQuestions,
    getActiveSession,
};
//# sourceMappingURL=session-query.service.js.map