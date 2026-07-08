import { Types } from "mongoose";

import { ExamSession } from "../../examSession/examSession.model";
import { ExamSessionStatus } from "../../examSession/examSession.constant";
import { TExamType } from "../examEngine.constant";

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
  const questions = payload.questions.map(
    (questionId: Types.ObjectId, index: number) => ({
      questionId,
      order: index + 1,
    }),
  );

  return await ExamSession.create({
    userId: new Types.ObjectId(payload.userId),
    examType: payload.examType,
    questions,

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

export const SessionCreatorService = {
  createSession,
};
