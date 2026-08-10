import { Types } from "mongoose";

import { TExamType } from "../ExamEngine/examEngine.constant";

// ============================================================
// OPTION
// ============================================================

export type TOptionLabel = "A" | "B" | "C" | "D";

// ============================================================
// SESSION QUESTION
// ============================================================

export interface IExamSessionQuestion {
  questionId: Types.ObjectId;
  order: number;
}

// ============================================================
// EXAM ANSWER
// ============================================================

export interface IExamAnswer {
  questionId: Types.ObjectId;

  selectedOption: TOptionLabel;

  correctOption?: TOptionLabel;

  isCorrect?: boolean;

  timeTaken?: number;
}

// ============================================================
// SESSION RESULT
// ============================================================

export interface IExamSessionResult {
  score: number;
  correct: number;
  wrong: number;
  skipped: number;
  accuracy: number;
}

// ============================================================
// EXAM SESSION
// ============================================================

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

  /**
   * Duration in minutes.
   */
  duration: number;

  totalMarks: number;

  negativeMark: number;

  startTime: Date;

  submittedAt?: Date;

  endTime?: Date;

  result?: IExamSessionResult;

  createdAt?: Date;

  updatedAt?: Date;
}

// ============================================================
// SUBMIT ANSWER
// ============================================================

export interface ISubmitAnswerPayload {
  sessionId: string;

  questionId: string;

  selectedOption: TOptionLabel;

  timeTaken?: number;
}
