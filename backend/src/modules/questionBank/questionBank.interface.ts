import { Model, Types } from "mongoose";
import {
  TQuestionBankCategory,
  TQuestionBankPaper,
  TQuestionBankVisibility,
} from "./questionBank.constant";

export interface IQuestionBank {
  _id?: Types.ObjectId;

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

  deletedBy?: Types.ObjectId | null;

  createdBy: Types.ObjectId;

  updatedBy?: Types.ObjectId;

  createdAt?: Date;

  updatedAt?: Date;
}

export interface QuestionBankModel extends Model<IQuestionBank> {
  isSlugExists(slug: string): Promise<IQuestionBank | null>;
}
