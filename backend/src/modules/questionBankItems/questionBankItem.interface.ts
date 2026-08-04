import { Model, Types } from "mongoose";

export interface IQuestionBankItem {
  _id?: Types.ObjectId;

  questionBank: Types.ObjectId;

  question: Types.ObjectId;

  order: number;

  marks: number;

  negativeMarks: number;

  isActive: boolean;

  status?: "PENDING" | "APPROVED" | "REJECTED";

  createdBy?: Types.ObjectId;

  submittedBy?: Types.ObjectId;

  updatedBy?: Types.ObjectId;

  reviewedBy?: Types.ObjectId;

  reviewedAt?: Date;

  reviewRemark?: string;

  createdAt?: Date;

  updatedAt?: Date;
}

export interface QuestionBankItemModel extends Model<IQuestionBankItem> {
  isQuestionExistsInBank(
    questionBank: Types.ObjectId,
    question: Types.ObjectId,
  ): Promise<IQuestionBankItem | null>;
}
