import { Types } from "mongoose";
import httpStatus from "http-status";

import AppError from "../../error/AppError";

import { ExamSession } from "./examSession.model";
import { ExamSessionStatus } from "./examSession.constant";
import { calculateRemainingTime, hasSessionExpired } from "./examSession.utils";
import { HydratedDocument } from "mongoose";
import { IExamSession } from "./examSession.interface";
type IExamSessionDocument = HydratedDocument<IExamSession>;
import { TExamType } from "../ExamEngine/examEngine.constant";
import { ISubmitAnswerPayload } from "./examSession.interface";
import { Question } from "../Questions/question.model";

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
  const formattedQuestions = payload.questions.map((questionId, index) => ({
    questionId,
    order: index + 1,
  }));

  return await ExamSession.create({
    userId: new Types.ObjectId(payload.userId),

    examType: payload.examType,

    questions: formattedQuestions,

    settings: {
      shuffleQuestions: payload.settings?.shuffleQuestions ?? false,
      shuffleOptions: payload.settings?.shuffleOptions ?? false,
    },

    duration: payload.duration,

    totalMarks: payload.totalMarks,

    negativeMark: payload.negativeMark,

    status: ExamSessionStatus.RUNNING,

    startTime: new Date(),
  });
};

const getSessionById = async (sessionId: string, userId: string) => {
  const session = await ExamSession.findById(sessionId).populate(
    "questions.questionId",
  );

  if (!session) {
    throw new AppError(httpStatus.NOT_FOUND, "Exam session not found");
  }

  // Ownership validation
  if (session.userId.toString() !== userId) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "You are not allowed to access this session",
    );
  }

  return {
    ...session.toObject(),
    remainingTime: calculateRemainingTime(session.startTime, session.duration),
  };
};

const submitSession = async (sessionId: string, userId: string) => {
  const session = await ExamSession.findById(sessionId);

  if (!session) {
    throw new AppError(httpStatus.NOT_FOUND, "Exam session not found");
  }

  // Ownership validation
  if (session.userId.toString() !== userId) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "You cannot submit another user's exam.",
    );
  }

  if (session.status === ExamSessionStatus.SUBMITTED) {
    throw new AppError(httpStatus.BAD_REQUEST, "Exam already submitted");
  }

  session.status = ExamSessionStatus.SUBMITTED;

  session.submittedAt = new Date();

  session.endTime = new Date();

  await session.save();

  // Persist exam result
  await ResultService.createResult(session._id.toString());

  return session;
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
  const session = await ExamSession.findById(payload.sessionId);

  if (!session) {
    throw new AppError(httpStatus.NOT_FOUND, "Exam session not found");
  }

  if (session.userId.toString() !== userId) {
    throw new AppError(httpStatus.FORBIDDEN, "Access denied");
  }

  if (session.status !== ExamSessionStatus.RUNNING) {
    throw new AppError(httpStatus.BAD_REQUEST, "Exam already finished");
  }

  const question = await Question.findById(payload.questionId);

  if (!question) {
    throw new AppError(httpStatus.NOT_FOUND, "Question not found");
  }

  const existingAnswer = session.answers.find(
    (answer) => answer.questionId.toString() === payload.questionId,
  );

  const isCorrect = question.correctAnswer === payload.selectedOption;

  if (existingAnswer) {
    existingAnswer.selectedOption = payload.selectedOption;
    existingAnswer.timeTaken = payload.timeTaken ?? 0;
    existingAnswer.isCorrect = isCorrect;
  } else {
    session.answers.push({
      questionId: question._id,
      selectedOption: payload.selectedOption,
      isCorrect,
      timeTaken: payload.timeTaken ?? 0,
    });
  }
await validateRunningSession(session);
  await session.save();

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
export const ExamSessionService = {
  createSession,
  getRunningSession,
  getSessionById,
  submitAnswer,
  submitSession,
};
