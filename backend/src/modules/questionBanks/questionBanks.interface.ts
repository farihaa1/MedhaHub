import { Model, Types } from "mongoose";

import {
  TQuestionBanksCategory,
  TQuestionBanksPaper,
  TQuestionBanksStatus,
  TQuestionBanksVisibility,
} from "./questionBanks.constant";

export interface IQuestionBanks {
  _id?: Types.ObjectId;

  /**
   * Example:
   * 46th BCS Preliminary
   */
  title: string;

  /**
   * Description
   */
  description?: string;

  /**
   * SEO URL
   *
   * Admin:
   * 46th-bcs-preliminary
   *
   * User Submission:
   * null until approved
   */
  slug?: string | null;

  /**
   * Category
   */
  category: TQuestionBanksCategory;

  /**
   * Example:
   * Bangladesh PSC
   * Bangladesh Bank
   * NTRCA
   */
  organization?: string;

  /**
   * Exam Year
   */
  year?: number;

  /**
   * Preliminary / Written / Viva
   */
  paper?: TQuestionBanksPaper;

  /**
   * Public / Private
   */
  visibility: TQuestionBanksVisibility;

  /**
   * Auto updated whenever
   * questions are added/removed
   */
  totalQuestions: number;

  /**
   * Premium Question Bank
   */
  isPremium: boolean;

  /**
   * Workflow Status
   */
  status: TQuestionBanksStatus;
  reviewRemark?: string;
  approvedBy?: Types.ObjectId | null;
  approvedAt?: Date | null;
  publishedAt?: Date | null;
  isDeleted: boolean;
  deletedAt?: Date | null;
  deletedBy?: Types.ObjectId | null;
  restoredAt?: Date | null;
  restoredBy?: Types.ObjectId | null;
  createdBy: Types.ObjectId;
  updatedBy?: Types.ObjectId | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface QuestionBanksModel extends Model<IQuestionBanks> {
  /**
   * Check slug uniqueness
   */
  isSlugExists(slug: string): Promise<IQuestionBanks | null>;

  /**
   * Count published banks
   */
  countPublished(): Promise<number>;
}
