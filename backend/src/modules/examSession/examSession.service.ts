import { Types } from "mongoose";
import httpStatus from "http-status";
import AppError from "../../error/AppError";
import { ExamSession } from "./examSession.model";
import { ExamSessionStatus } from "./examSession.constant";
import { hasSessionExpired } from "./examSession.utils";
import { HydratedDocument } from "mongoose";
import { IExamSession } from "./examSession.interface";
type IExamSessionDocument = HydratedDocument<IExamSession>;
import { TExamType } from "../ExamEngine/examEngine.constant";
import { ISubmitAnswerPayload } from "./examSession.interface";
import { mapExamSession } from "./mapper/examSession.mapper";
import { SessionQueryService } from "./services/session-query.service";
import { SessionValidationService } from "./services/session-validation.service";
import { AnswerService } from "./services/answer.service";
import { ResultService } from "../Result/result.service";
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
  const formattedQuestions = payload.questions.map((id, index) => ({
    questionId: id,
    order: index + 1,
  }));
  return ExamSession.create({
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

    status: ExamSessionStatus.RUNNING,

    startTime: new Date(),
  });
};
const getSessionById = async (sessionId: string, userId: string) => {
  console.log("SESSION ID:", sessionId);
  console.log("USER ID:", userId);

  const session = await SessionQueryService.getOwnedSessionWithQuestions(
    sessionId,
    userId,
  );

  console.log("SESSION:", session);

  await SessionValidationService.ensureSessionIsRunning(session);

  return mapExamSession(session);
};

const submitSession = async (sessionId: string, userId: string) => {
  const session = await SessionQueryService.getOwnedSession(sessionId, userId);
  if (!session) {
    throw new AppError(httpStatus.NOT_FOUND, "Exam session not found");
  }

  if (session.status === ExamSessionStatus.SUBMITTED) {
    throw new AppError(httpStatus.BAD_REQUEST, "Exam already submitted");
  }

  session.status = ExamSessionStatus.SUBMITTED;

  session.submittedAt = new Date();

  session.endTime = new Date();

  await session.save();

  // Persist exam result

  const result = await ResultService.createResult(session._id.toString());
  return {
    session,
    result,
  };
};

const validateRunningSession = async (session: IExamSessionDocument) => {
  if (
    hasSessionExpired(session.startTime, session.duration) &&
    session.status === ExamSessionStatus.RUNNING
  ) {
    session.status = ExamSessionStatus.EXPIRED;
    session.endTime = new Date();

    await session.save();

    throw new AppError(httpStatus.BAD_REQUEST, "Exam time has expired.");
  }
};

const submitAnswer = async (payload: ISubmitAnswerPayload, userId: string) => {
  const session = await SessionQueryService.getOwnedSession(
    payload.sessionId,
    userId,
  );

  await SessionValidationService.ensureSessionIsRunning(session);

  return AnswerService.saveAnswer(session, payload);
};

export const ExamSessionService = {
  createSession,
  getSessionById,
  submitAnswer,
  submitSession,
};
