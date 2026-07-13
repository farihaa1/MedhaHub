import { getExamStrategy } from "./factory/examStrategy.factory";

import { IStartExamPayload } from "./examEngine.interface";
import { ExamSessionService } from "../examSession/examSession.service";
import { hasSessionExpired } from "../examSession/examSession.utils";
import { ExamSessionStatus } from "../examSession/examSession.constant";
import { SessionQueryService } from "../examSession/services/session-query.service";

const startExam = async (payload: IStartExamPayload) => {
  /**
   * ---------------------------------------
   * STEP 1
   * Check for existing running session
   * ---------------------------------------
   */

const runningSession = await SessionQueryService.getRunningSession(
  payload.userId,
  payload.examType,
);

  if (runningSession) {
    /**
     * Expired?
     */
    if (hasSessionExpired(runningSession.startTime, runningSession.duration)) {
      runningSession.status = ExamSessionStatus.EXPIRED;
      runningSession.endTime = new Date();

      await runningSession.save();
    } else {
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

  const strategy = getExamStrategy(payload.examType);

  const examConfig = await strategy.generateExam(payload);

  /**
   * ---------------------------------------
   * STEP 3
   * Create Session
   * ---------------------------------------
   */

  const session = await ExamSessionService.createSession({
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

export const ExamEngineService = {
  startExam,
};
