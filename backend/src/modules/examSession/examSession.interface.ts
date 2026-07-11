import { Types } from "mongoose";
import { TExamSessionStatus } from "./examSession.constant";
import { TExamType } from "../ExamEngine/examEngine.constant";

export interface IExamSessionQuestion {
  questionId: Types.ObjectId;
  order: number;
}

export interface IExamAnswer {
  questionId: Types.ObjectId;

  selectedOption?: "A" | "B" | "C" | "D";

  isCorrect: boolean;

  timeTaken: number;
}

export interface IExamSession {
  userId: Types.ObjectId;

  examType: TExamType;

  source?: {
    type:
      | "topic"
      | "chapter"
      | "subject"
      | "practice_set"
      | "model_test"
      | "previous_year"
      | "daily";

    id?: Types.ObjectId;
  };

  questions: IExamSessionQuestion[];

  answers: IExamAnswer[];

  settings: {
    shuffleQuestions: boolean;
    shuffleOptions: boolean;
  };

  duration: number;

  totalMarks: number;

  negativeMark: number;

  status: TExamSessionStatus;

  startTime: Date;

  endTime?: Date;

  submittedAt?: Date;

  createdAt?: Date;

  updatedAt?: Date;
  result?: {
    score: number;
    correct: number;
    wrong: number;
    skipped: number;
    accuracy: number;
  };
}
export interface ISubmitAnswerPayload {
  sessionId: string;
  questionId: string;
  selectedOption: "A" | "B" | "C" | "D";
  timeTaken?: number;
}