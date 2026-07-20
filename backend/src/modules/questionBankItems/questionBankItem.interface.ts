import { Model, Types } from "mongoose";

export interface TQuestionBankItem {
  questionBank: Types.ObjectId;

  question: Types.ObjectId;

  order: number;

  marks: number;

  negativeMarks: number;

  isActive: boolean;

  createdBy: Types.ObjectId;

  updatedBy?: Types.ObjectId;
}

export interface QuestionBankItemModel extends Model<TQuestionBankItem> {
  isQuestionExistsInBank(
    questionBank: Types.ObjectId,
    question: Types.ObjectId,
  ): Promise<TQuestionBankItem | null>;
}
