import { Types } from "mongoose";
import httpStatus from "http-status";
import AppError from "../../error/AppError";
import { ExamSession } from "./examSession.model";
import { hasSessionExpired } from "./examSession.utils";
import { TExamType } from "../ExamEngine/examEngine.constant";
import { ISubmitAnswerPayload } from "./examSession.interface";
import { mapExamSession } from "./mapper/examSession.mapper";
import { SessionQueryService } from "./services/session-query.service";
import { SessionValidationService } from "./services/session-validation.service";
import { AnswerService } from "./services/answer.service";
import { ResultService } from "../Result/result.service";
import { ExamSessionStatus } from "./examSession.constant";

interface ICreateSession {
  userId: string;
  examType: TExamType;
  questions: Types.ObjectId[];
  duration: number;
  totalMarks: number;
  negativeMark: number;
  settings?: {
    shuffleQuestions?: boolean;
    shuffleOptions?: boolean;
  };
}

const createSession = async (payload: ICreateSession) => {

  if (!payload.questions.length) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "At least one question is required.",
    );
  }

  const formattedQuestions = payload.questions.map((questionId, index) => ({
    questionId,
    order: index + 1,
  }));

  const session = await ExamSession.create({
    userId: new Types.ObjectId(payload.userId),
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

const getSessionById = async (sessionId: string, userId: string) => {

  const session = await SessionQueryService.getOwnedSessionWithQuestions(
    sessionId,
    userId,
  );

  if (session.submittedAt) {
    return mapExamSession(session);
  }

  if (session.endTime) {
    return mapExamSession(session);
  }

  if (hasSessionExpired(session.startTime, session.duration)) {
    session.endTime = new Date();

    await session.save();

    await ResultService.createResult(session._id.toString());
  }

  return mapExamSession(session);
};

const submitAnswer = async (payload: ISubmitAnswerPayload, userId: string) => {
  
  const session = await SessionQueryService.getOwnedSession(
    payload.sessionId,
    userId,
  );

  await SessionValidationService.ensureSessionIsRunning(session);

  return AnswerService.saveAnswer(session, payload);
};

const submitSession = async (sessionId: string, userId: string) => {
  const session = await ExamSession.findOne({
    _id: sessionId,
    userId,
  });

  if (!session) {
    throw new AppError(httpStatus.NOT_FOUND, "Exam session not found.");
  }

  if (session.status === ExamSessionStatus.SUBMITTED) {
    return session;
  }

  if (session.status === ExamSessionStatus.EXPIRED) {
    throw new AppError(httpStatus.BAD_REQUEST, "Exam has already expired.");
  }

  // Change status
  session.status = ExamSessionStatus.SUBMITTED;

  session.submittedAt = new Date();

  await session.save();

  // IMPORTANT:
  // Create Result AFTER session is submitted
  await ResultService.createResult(sessionId);

  return session;
};

export const ExamSessionService = {
  createSession,

  getSessionById,

  submitAnswer,

  submitSession,
};
