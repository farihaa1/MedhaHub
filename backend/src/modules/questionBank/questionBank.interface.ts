import { Model, Types } from "mongoose";
import {
  QuestionBankCategory,
  QuestionBankPaper,
  QuestionBankVisibility,
} from "./questionBank.constant";

export type TQuestionBankCategory =
  (typeof QuestionBankCategory)[keyof typeof QuestionBankCategory];

export type TQuestionBankPaper =
  (typeof QuestionBankPaper)[keyof typeof QuestionBankPaper];

export type TQuestionBankVisibility =
  (typeof QuestionBankVisibility)[keyof typeof QuestionBankVisibility];

export interface TQuestionBank {
  title: string;

  slug: string;

  category: TQuestionBankCategory;

  year?: number;

  paper?: TQuestionBankPaper;

  organization?: string;

  description?: string;

  visibility: TQuestionBankVisibility;

  totalQuestions: number;

  isPublished: boolean;

  isPremium: boolean;
  isDeleted: boolean;

  deletedAt?: Date | null;

  deletedBy?: Types.ObjectId;
  createdBy: Types.ObjectId;

  updatedBy?: Types.ObjectId;
}

export interface QuestionBankModel extends Model<TQuestionBank> {
  isSlugExists(slug: string): Promise<TQuestionBank | null>;
}
