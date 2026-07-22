import { Types } from "mongoose";
import {
  TQuestionDifficulty,
  TQuestionSourceType,
  TQuestionStatus,
  TQuestionType,
} from "./question.constant";

export interface IQuestionOption {
  _id: Types.ObjectId;

  text: string;

  image?: string;

  isCorrect: boolean;
}

export interface IQuestionSource {
  type: TQuestionSourceType;

  name: string;

  year?: number;
}

export interface IQuestion {
  _id: Types.ObjectId;

  // Classification
  subject: Types.ObjectId;
  chapter: Types.ObjectId;
  topic: Types.ObjectId;

  // Question
  type: TQuestionType;
  questionText: string;
  questionImage?: string;
  options: IQuestionOption[];

  // Learning
  explanation?: string;
  explanationImage?: string;

  // Previous exams / Model tests
  sources?: IQuestionSource[];

  // Search
  tags?: string[];
  difficulty?: TQuestionDifficulty;

  // Workflow
  status: TQuestionStatus;
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
