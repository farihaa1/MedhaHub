import { Types } from "mongoose";

import {
  TQuestionDifficulty,
  TQuestionSourceType,
  TQuestionStatus,
  TQuestionType,
} from "./question.constant";

export interface IQuestionOption {
  _id?: Types.ObjectId;
  text: string;
  image?: string | null;
  isCorrect: boolean;
}

export interface IQuestionSource {
  type: TQuestionSourceType;
  name: string;
  year?: number;
}

export interface IQuestion {
  _id?: Types.ObjectId;

  // =========================================================
  // CLASSIFICATION
  // =========================================================

  subjectId: Types.ObjectId;
  chapterId: Types.ObjectId;
  topicId: Types.ObjectId;

  // =========================================================
  // QUESTION
  // =========================================================

  type: TQuestionType;
  questionText: string;
  normalizedQuestion?: string;

  questionImage?: string | null;

  options: IQuestionOption[];

  // =========================================================
  // LEARNING
  // =========================================================

  explanation?: string;
  explanationImage?: string | null;

  // =========================================================
  // SOURCES
  // =========================================================

  sources?: IQuestionSource[];

  // =========================================================
  // SEARCH / METADATA
  // =========================================================

  tags?: string[];
  difficulty?: TQuestionDifficulty;

  // =========================================================
  // WORKFLOW
  // =========================================================

  status: TQuestionStatus;

  isCategorized: boolean;

  approvedBy?: Types.ObjectId;
  approvedAt?: Date;

  createdBy: Types.ObjectId;

  createdAt?: Date;
  updatedAt?: Date;
}

export interface IQuestionStats {
  total: number;
  published: number;
  draft: number;
  pending: number;
  rejected: number;
  premium: number;
  reported: number;
  today: number;
}
