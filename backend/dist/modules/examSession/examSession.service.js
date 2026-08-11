"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExamSessionService = void 0;
const mongoose_1 = require("mongoose");
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../error/AppError"));
const examSession_model_1 = require("./examSession.model");
const examSession_utils_1 = require("./examSession.utils");
const examSession_mapper_1 = require("./mapper/examSession.mapper");
const session_query_service_1 = require("./services/session-query.service");
const session_validation_service_1 = require("./services/session-validation.service");
const answer_service_1 = require("./services/answer.service");
const result_service_1 = require("../Result/result.service");
const examSession_constant_1 = require("./examSession.constant");
const createSession = async (payload) => {
    if (!payload.questions.length) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "At least one question is required.");
    }
    const formattedQuestions = payload.questions.map((questionId, index) => ({
        questionId,
        order: index + 1,
    }));
    const session = await examSession_model_1.ExamSession.create({
        userId: new mongoose_1.Types.ObjectId(payload.userId),
        examType: payload.examType,
        questions: formattedQuestions,
        duration: payload.duration,
        totalMarks: payload.totalMarks,
        negativeMark: payload.negativeMark,
        settings: {
            shuffleQuestions: payload.settings?.shuffleQuestions ?? false,
            shuffleOptions: payload.settings?.shuffleOptions ?? false,
        },
        answers: [],
        startTime: new Date(),
    });
    return session;
};
const getSessionById = async (sessionId, userId) => {
    const session = await session_query_service_1.SessionQueryService.getOwnedSessionWithQuestions(sessionId, userId);
    if (session.submittedAt) {
        return (0, examSession_mapper_1.mapExamSession)(session);
    }
    if (session.endTime) {
        return (0, examSession_mapper_1.mapExamSession)(session);
    }
    if ((0, examSession_utils_1.hasSessionExpired)(session.startTime, session.duration)) {
        session.endTime = new Date();
        await session.save();
        await result_service_1.ResultService.createResult(session._id.toString());
    }
    return (0, examSession_mapper_1.mapExamSession)(session);
};
const submitAnswer = async (payload, userId) => {
    const session = await session_query_service_1.SessionQueryService.getOwnedSession(payload.sessionId, userId);
    await session_validation_service_1.SessionValidationService.ensureSessionIsRunning(session);
    return answer_service_1.AnswerService.saveAnswer(session, payload);
};
const submitSession = async (sessionId, userId) => {
    const session = await examSession_model_1.ExamSession.findOne({
        _id: sessionId,
        userId,
    });
    if (!session) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Exam session not found.");
    }
    if (session.status === examSession_constant_1.ExamSessionStatus.SUBMITTED) {
        return session;
    }
    if (session.status === examSession_constant_1.ExamSessionStatus.EXPIRED) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Exam has already expired.");
    }
    // Change status
    session.status = examSession_constant_1.ExamSessionStatus.SUBMITTED;
    session.submittedAt = new Date();
    await session.save();
    // IMPORTANT:
    // Create Result AFTER session is submitted
    await result_service_1.ResultService.createResult(sessionId);
    return session;
};
exports.ExamSessionService = {
    createSession,
    getSessionById,
    submitAnswer,
    submitSession,
};
//# sourceMappingURL=examSession.service.js.map