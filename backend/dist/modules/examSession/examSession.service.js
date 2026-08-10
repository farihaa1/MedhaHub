"use strict";
// modules/examSession/examSession.service.ts
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
    // ----------------------------------------------------------
    // Validate questions
    // ----------------------------------------------------------
    if (!payload.questions.length) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "At least one question is required.");
    }
    // ----------------------------------------------------------
    // Create question order
    // ----------------------------------------------------------
    const formattedQuestions = payload.questions.map((questionId, index) => ({
        questionId,
        order: index + 1,
    }));
    // ----------------------------------------------------------
    // Create session
    // ----------------------------------------------------------
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
        status: examSession_constant_1.ExamSessionStatus.RUNNING,
        startTime: new Date(),
    });
    return session;
};
// ============================================================
// GET SESSION
// ============================================================
const getSessionById = async (sessionId, userId) => {
    // ----------------------------------------------------------
    // Get owned session with questions
    // ----------------------------------------------------------
    const session = await session_query_service_1.SessionQueryService.getOwnedSessionWithQuestions(sessionId, userId);
    // ----------------------------------------------------------
    // Check session expiration
    // ----------------------------------------------------------
    if (session.status === examSession_constant_1.ExamSessionStatus.RUNNING &&
        (0, examSession_utils_1.hasSessionExpired)(session.startTime, session.duration)) {
        // --------------------------------------------------------
        // Mark session expired
        // --------------------------------------------------------
        session.status = examSession_constant_1.ExamSessionStatus.EXPIRED;
        session.endTime = new Date();
        await session.save();
        // --------------------------------------------------------
        // Generate result
        // --------------------------------------------------------
        await result_service_1.ResultService.createResult(session._id.toString());
    }
    // ----------------------------------------------------------
    // Return mapped session
    // ----------------------------------------------------------
    return (0, examSession_mapper_1.mapExamSession)(session);
};
// ============================================================
// SUBMIT ANSWER
// ============================================================
const submitAnswer = async (payload, userId) => {
    // ----------------------------------------------------------
    // Find owned session
    // ----------------------------------------------------------
    const session = await session_query_service_1.SessionQueryService.getOwnedSession(payload.sessionId, userId);
    // ----------------------------------------------------------
    // Validate session
    // ----------------------------------------------------------
    await session_validation_service_1.SessionValidationService.ensureSessionIsRunning(session);
    // ----------------------------------------------------------
    // Save answer
    // ----------------------------------------------------------
    return answer_service_1.AnswerService.saveAnswer(session, payload);
};
// ============================================================
// SUBMIT SESSION
// ============================================================
const submitSession = async (sessionId, userId) => {
    // ----------------------------------------------------------
    // Get owned session
    // ----------------------------------------------------------
    const session = await session_query_service_1.SessionQueryService.getOwnedSession(sessionId, userId);
    // ==========================================================
    // ALREADY SUBMITTED
    // ==========================================================
    if (session.status === examSession_constant_1.ExamSessionStatus.SUBMITTED) {
        const result = await result_service_1.ResultService.createResult(session._id.toString());
        return {
            session,
            result,
        };
    }
    // ==========================================================
    // ALREADY EXPIRED
    // ==========================================================
    if (session.status === examSession_constant_1.ExamSessionStatus.EXPIRED) {
        const result = await result_service_1.ResultService.createResult(session._id.toString());
        return {
            session,
            result,
        };
    }
    // ==========================================================
    // CHECK SERVER TIME
    // ==========================================================
    if ((0, examSession_utils_1.hasSessionExpired)(session.startTime, session.duration)) {
        session.status = examSession_constant_1.ExamSessionStatus.EXPIRED;
        session.endTime = new Date();
        await session.save();
        const result = await result_service_1.ResultService.createResult(session._id.toString());
        return {
            session,
            result,
        };
    }
    // ==========================================================
    // NORMAL SUBMISSION
    // ==========================================================
    session.status = examSession_constant_1.ExamSessionStatus.SUBMITTED;
    session.submittedAt = new Date();
    session.endTime = session.submittedAt;
    await session.save();
    // ==========================================================
    // CREATE RESULT
    // ==========================================================
    const result = await result_service_1.ResultService.createResult(session._id.toString());
    return {
        session,
        result,
    };
};
// ============================================================
// EXPORT
// ============================================================
exports.ExamSessionService = {
    createSession,
    getSessionById,
    submitAnswer,
    submitSession,
};
//# sourceMappingURL=examSession.service.js.map