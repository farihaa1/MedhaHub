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
const examSession_constant_1 = require("./examSession.constant");
const examSession_utils_1 = require("./examSession.utils");
const examSession_mapper_1 = require("./mapper/examSession.mapper");
const session_query_service_1 = require("./services/session-query.service");
const session_validation_service_1 = require("./services/session-validation.service");
const answer_service_1 = require("./services/answer.service");
const result_service_1 = require("../Result/result.service");
const createSession = async (payload) => {
    const formattedQuestions = payload.questions.map((id, index) => ({
        questionId: id,
        order: index + 1,
    }));
    return examSession_model_1.ExamSession.create({
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
        status: examSession_constant_1.ExamSessionStatus.RUNNING,
        startTime: new Date(),
    });
};
const getSessionById = async (sessionId, userId) => {
    console.log("SESSION ID:", sessionId);
    console.log("USER ID:", userId);
    const session = await session_query_service_1.SessionQueryService.getOwnedSessionWithQuestions(sessionId, userId);
    console.log("SESSION:", session);
    await session_validation_service_1.SessionValidationService.ensureSessionIsRunning(session);
    return (0, examSession_mapper_1.mapExamSession)(session);
};
const submitSession = async (sessionId, userId) => {
    const session = await session_query_service_1.SessionQueryService.getOwnedSession(sessionId, userId);
    if (!session) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Exam session not found");
    }
    if (session.status === examSession_constant_1.ExamSessionStatus.SUBMITTED) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Exam already submitted");
    }
    session.status = examSession_constant_1.ExamSessionStatus.SUBMITTED;
    session.submittedAt = new Date();
    session.endTime = new Date();
    await session.save();
    // Persist exam result
    const result = await result_service_1.ResultService.createResult(session._id.toString());
    return {
        session,
        result,
    };
};
const validateRunningSession = async (session) => {
    if ((0, examSession_utils_1.hasSessionExpired)(session.startTime, session.duration) &&
        session.status === examSession_constant_1.ExamSessionStatus.RUNNING) {
        session.status = examSession_constant_1.ExamSessionStatus.EXPIRED;
        session.endTime = new Date();
        await session.save();
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Exam time has expired.");
    }
};
const submitAnswer = async (payload, userId) => {
    const session = await session_query_service_1.SessionQueryService.getOwnedSession(payload.sessionId, userId);
    await session_validation_service_1.SessionValidationService.ensureSessionIsRunning(session);
    return answer_service_1.AnswerService.saveAnswer(session, payload);
};
exports.ExamSessionService = {
    createSession,
    getSessionById,
    submitAnswer,
    submitSession,
};
//# sourceMappingURL=examSession.service.js.map