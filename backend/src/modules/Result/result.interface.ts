// modules/Result/result.interface.ts

import { Types } from "mongoose";

export interface IResult {
  sessionId: Types.ObjectId;

  userId: Types.ObjectId;

  totalQuestions: number;

  attempted: number;

  correct: number;

  wrong: number;

  skipped: number;

  score: number;

  accuracy: number;

  negativeMark: number;

  createdAt?: Date;

  updatedAt?: Date;
}
