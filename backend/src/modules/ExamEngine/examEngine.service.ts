import { Types } from "mongoose";
import { getExamStrategy } from "./factory/examStrategy.factory";
import { IStartExamPayload } from "./examEngine.interface";
import { ExamSessionService } from "../examSession/examSession.service";

const startExam = async (payload: IStartExamPayload) => {
  // 1. Select strategy based on exam type
  const strategy = getExamStrategy(payload.examType);
  // 2. Generate exam configuration
  const examConfig = await strategy.generateExam(payload);

  // 3. Create exam session

  const examSession = await ExamSessionService.createSession({
    userId: payload.userId,
    examType: payload.examType,
    questions: examConfig.questions,
    duration: examConfig.duration,
    totalMarks: examConfig.totalMarks,
    negativeMark: examConfig.negativeMark ?? 0,
    settings: {
      shuffleQuestions: examConfig.shuffleQuestions,
      shuffleOptions: examConfig.shuffleOptions,
    },
  });

  return examSession;
};


export interface IExamConfiguration {
  questions: Types.ObjectId[];
  duration: number;
  totalMarks: number;
  negativeMark: number;
  shuffleQuestions: boolean;
  shuffleOptions: boolean;
}

export const ExamEngineService = {
  startExam,
};
