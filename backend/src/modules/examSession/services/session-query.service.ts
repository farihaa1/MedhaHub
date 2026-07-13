import httpStatus from "http-status";

import AppError from "../../../error/AppError";

import { ExamSession } from "../examSession.model";
import { ExamSessionStatus } from "../examSession.constant";
import { TExamType } from "../../ExamEngine/examEngine.constant";

const getSessionById = async (sessionId: string) => {
  const session = await ExamSession.findById(sessionId);

  if (!session) {
    throw new AppError(httpStatus.NOT_FOUND, "Exam session not found");
  }

  return session;
};

const getOwnedSession = async (sessionId: string, userId: string) => {
  const session = await getSessionById(sessionId);

  if (session.userId.toString() !== userId) {
    throw new AppError(httpStatus.FORBIDDEN, "Access denied");
  }

  return session;
};

const getOwnedSessionWithQuestions = async (
  sessionId: string,
  userId: string,
) => {
  const session = await ExamSession.findById(sessionId).populate(
    "questions.questionId",
  );

  if (!session) {
    throw new AppError(httpStatus.NOT_FOUND, "Exam session not found");
  }

  if (session.userId.toString() !== userId) {
    throw new AppError(httpStatus.FORBIDDEN, "Access denied");
  }

  return session;
};

const getRunningSession = async (userId: string, examType: TExamType) => {
  return ExamSession.findOne({
    userId,
    examType,
    status: ExamSessionStatus.RUNNING,
  }).sort({
    createdAt: -1,
  });
};

export const SessionQueryService = {
  getSessionById,
  getOwnedSession,
  getOwnedSessionWithQuestions,
  getRunningSession,
};
