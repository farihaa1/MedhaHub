import { Types } from "mongoose";

export interface IResult {
  userId: Types.ObjectId;

  sessionId: Types.ObjectId;

  examType: string;

  totalQuestions: number;

  attempted: number;

  correct: number;

  wrong: number;

  skipped: number;

  score: number;

  accuracy: number;

  negativeMark: number;

  submittedAt: Date;

  createdAt?: Date;

  updatedAt?: Date;
}
