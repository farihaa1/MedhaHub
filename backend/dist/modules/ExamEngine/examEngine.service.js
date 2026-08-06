"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExamEngineService = void 0;
const examStrategy_factory_1 = require("./factory/examStrategy.factory");
const examSession_service_1 = require("../examSession/examSession.service");
const examSession_utils_1 = require("../examSession/examSession.utils");
const examSession_constant_1 = require("../examSession/examSession.constant");
const session_query_service_1 = require("../examSession/services/session-query.service");
const startExam = async (payload) => {
    /**
     * ---------------------------------------
     * STEP 1
     * Check for existing running session
     * ---------------------------------------
     */
    const runningSession = await session_query_service_1.SessionQueryService.getRunningSession(payload.userId, payload.examType);
    if (runningSession) {
        /**
         * Expired?
         */
        if ((0, examSession_utils_1.hasSessionExpired)(runningSession.startTime, runningSession.duration)) {
            runningSession.status = examSession_constant_1.ExamSessionStatus.EXPIRED;
            runningSession.endTime = new Date();
            await runningSession.save();
        }
        else {
            /**
             * Resume exam
             */
            return runningSession;
        }
    }
    /**
     * ---------------------------------------
     * STEP 2
     * Generate Exam
     * ---------------------------------------
     */
    const strategy = (0, examStrategy_factory_1.getExamStrategy)(payload.examType);
    const examConfig = await strategy.generateExam(payload);
    /**
     * ---------------------------------------
     * STEP 3
     * Create Session
     * ---------------------------------------
     */
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
    return session;
};
exports.ExamEngineService = {
    startExam,
};
//# sourceMappingURL=examEngine.service.js.map