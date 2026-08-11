"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExamEngineService = void 0;
const examStrategy_factory_1 = require("./factory/examStrategy.factory");
const examSession_service_1 = require("../examSession/examSession.service");
const examSession_utils_1 = require("../examSession/examSession.utils");
const session_query_service_1 = require("../examSession/services/session-query.service");
// ============================================================
// START EXAM
// ============================================================
const startExam = async (payload) => {
    // ==========================================================
    // STEP 1: CHECK EXISTING ACTIVE SESSION
    // ==========================================================
    const activeSession = await session_query_service_1.SessionQueryService.getActiveSession(payload.userId, payload.examType);
    if (activeSession) {
        // --------------------------------------------------------
        // Existing session expired
        // --------------------------------------------------------
        if ((0, examSession_utils_1.hasSessionExpired)(activeSession.startTime, activeSession.duration)) {
            activeSession.endTime = new Date();
            await activeSession.save();
        }
        else {
            // ------------------------------------------------------
            // Existing session is still active
            // Resume it
            // ------------------------------------------------------
            return activeSession;
        }
    }
    // ==========================================================
    // STEP 2: GET EXAM STRATEGY
    // ==========================================================
    const strategy = (0, examStrategy_factory_1.getExamStrategy)(payload.examType);
    // ==========================================================
    // STEP 3: GENERATE EXAM CONFIG
    // ==========================================================
    const examConfig = await strategy(payload);
    // ==========================================================
    // STEP 4: CREATE SESSION
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
    // STEP 5: RETURN SESSION
    // ==========================================================
    return session;
};
exports.ExamEngineService = {
    startExam,
};
//# sourceMappingURL=examEngine.service.js.map