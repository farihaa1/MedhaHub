import { Model, Types } from "mongoose";

export interface IQuestionBankItem {
  _id?: Types.ObjectId;

  questionBank: Types.ObjectId;

  question: Types.ObjectId;

  order: number;

  marks: number;

  negativeMarks: number;

  isActive: boolean;

  createdBy: Types.ObjectId;

  updatedBy?: Types.ObjectId;

  createdAt?: Date;

  updatedAt?: Date;
}

export interface QuestionBankItemModel extends Model<IQuestionBankItem> {
  isQuestionExistsInBank(
    questionBank: Types.ObjectId,
    question: Types.ObjectId,
  ): Promise<IQuestionBankItem | null>;
}
