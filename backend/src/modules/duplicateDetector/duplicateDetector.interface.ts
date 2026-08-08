import { Types } from "mongoose";

import { DuplicateScope, DuplicateStatus } from "./duplicateDetector.constants";

export interface IDetectionScope {
  scope: DuplicateScope;

  subjectId?: string;

  chapterId?: string;

  topicId?: string;

  questionBankId?: string;

  modelTestId?: string;

  compareQuestionBankIds?: string[];

  compareModelTestIds?: string[];
}

export interface IQuestionForDuplicateDetection {
  _id: Types.ObjectId;

  questionText: string;

  exactHash?: string;

  normalizedText?: string;

  subjectId?: Types.ObjectId;

  chapterId?: Types.ObjectId;

  topicId?: Types.ObjectId;

  questionBankIds?: Types.ObjectId[];

  modelTestIds?: Types.ObjectId[];
}

export interface IDuplicatePairResult {
  _id: Types.ObjectId;

  questionA: unknown;

  questionB: unknown;

  similarity: number;

  exactMatch: boolean;

  scope: DuplicateScope;

  scopeId?: Types.ObjectId;

  status: DuplicateStatus;

  detectedAt: Date;

  reviewedAt?: Date;
}
