"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExamEngineService = void 0;
const examStrategy_factory_1 = require("./factory/examStrategy.factory");
const examSession_service_1 = require("../examSession/examSession.service");
const examSession_utils_1 = require("../examSession/examSession.utils");
const examSession_constant_1 = require("../examSession/examSession.constant");
const session_query_service_1 = require("../examSession/services/session-query.service");
// ============================================================
// START EXAM
// ============================================================
const startExam = async (payload) => {
    // ==========================================================
    // STEP 1: Check for an existing running session
    // ==========================================================
    const runningSession = await session_query_service_1.SessionQueryService.getRunningSession(payload.userId, payload.examType);
    if (runningSession) {
        // ========================================================
        // Existing session has expired
        // ========================================================
        if ((0, examSession_utils_1.hasSessionExpired)(runningSession.startTime, runningSession.duration)) {
            runningSession.status = examSession_constant_1.ExamSessionStatus.EXPIRED;
            runningSession.endTime = new Date();
            await runningSession.save();
        }
        else {
            // ======================================================
            // Existing session is still running
            // Resume it instead of creating another session
            // ======================================================
            return runningSession;
        }
    }
    // ==========================================================
    // STEP 2: Get exam strategy
    // ==========================================================
    const strategy = (0, examStrategy_factory_1.getExamStrategy)(payload.examType);
    // ==========================================================
    // STEP 3: Generate exam configuration
    // ==========================================================
    const examConfig = await strategy(payload);
    // ==========================================================
    // STEP 4: Create exam session
    // ==========================================================
    const session = await examSession_service_1.ExamSessionService.createSession({
        userId: payload.userId,
        examType: payload.examType,
        questions: examConfig.questions,
        duration: examConfig.duration,
        totalMarks: examConfig.totalMarks,
        negativeMark: examConfig.negativeMark,
        settings: {
            shuffleQuestions: examConfig.shuffleQuestions,
            shuffleOptions: examConfig.shuffleOptions,
        },
    });
    // ==========================================================
    // STEP 5: Return created session
    // ==========================================================
    return session;
};
exports.ExamEngineService = {
    startExam,
};
//# sourceMappingURL=examEngine.service.js.map