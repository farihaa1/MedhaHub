import { getExamStrategy } from "./factory/examStrategy.factory";

import { IStartExamPayload } from "./examEngine.interface";

import { ExamSessionService } from "../examSession/examSession.service";

import { hasSessionExpired } from "../examSession/examSession.utils";

import { SessionQueryService } from "../examSession/services/session-query.service";

// ============================================================
// START EXAM
// ============================================================

const startExam = async (payload: IStartExamPayload) => {
  // ==========================================================
  // STEP 1: CHECK EXISTING ACTIVE SESSION
  // ==========================================================

  const activeSession = await SessionQueryService.getActiveSession(
    payload.userId,
    payload.examType,
  );

  if (activeSession) {
    // --------------------------------------------------------
    // Existing session expired
    // --------------------------------------------------------

    if (hasSessionExpired(activeSession.startTime, activeSession.duration)) {
      activeSession.endTime = new Date();

      await activeSession.save();
    } else {
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

  const strategy = getExamStrategy(payload.examType);

  // ==========================================================
  // STEP 3: GENERATE EXAM CONFIG
  // ==========================================================

  const examConfig = await strategy(payload);

  // ==========================================================
  // STEP 4: CREATE SESSION
  // ==========================================================

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

  // ==========================================================
  // STEP 5: RETURN SESSION
  // ==========================================================

  return session;
};

export const ExamEngineService = {
  startExam,
};
