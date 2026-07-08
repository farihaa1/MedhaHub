import { Types } from "mongoose";
import httpStatus from "http-status";

import { ExamSession } from "./examSession.model";
import { ExamSessionStatus } from "./examSession.constant";
import { calculateRemainingTime } from "./examSession.utils";

import AppError from "../../error/AppError";
import { TExamType } from "../ExamEngine/examEngine.constant";

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

  const session = await ExamSession.create({
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

  return session;
};

const getSessionById = async (id: string) => {
  const session = await ExamSession.findById(id).populate(
    "questions.questionId",
  );

  if (!session) {
    throw new AppError(httpStatus.NOT_FOUND, "Exam session not found");
  }

  const remainingTime = calculateRemainingTime(
    session.startTime,
    session.duration,
  );

  return {
    ...session.toObject(),
    remainingTime,
  };
};

const submitSession = async (id: string) => {
  const session = await ExamSession.findById(id);

  if (!session) {
    throw new AppError(httpStatus.NOT_FOUND, "Exam session not found");
  }

  if (session.status === ExamSessionStatus.SUBMITTED) {
    throw new AppError(httpStatus.BAD_REQUEST, "Exam already submitted");
  }

  session.status = ExamSessionStatus.SUBMITTED;
  session.submittedAt = new Date();

  await session.save();

  return session;
};

export const ExamSessionService = {
  createSession,
  getSessionById,
  submitSession,
};
