import { Types } from "mongoose";
import { TQuestionStatus } from "./question.constant";

export interface IQuestion {
  _id: Types.ObjectId;

  // Classification
  subjectId: Types.ObjectId;
  chapterId: Types.ObjectId;
  topicId: Types.ObjectId;

  // MCQ Question
  questionText: string;

  options: {
    label: "A" | "B" | "C" | "D";
    text: string;
  }[];

  correctAnswer: "A" | "B" | "C" | "D";

  // Learning support
  explanation?: string;

  // Exam information
  examInfo?: {
    category: "BCS" | "Bank" | "Primary" | "NTRCA" | "Other";

    examName?: string;
    year?: number;
  };

  // Search/filter
  tags?: string[];

  // Management
  status: TQuestionStatus;

  approvedBy?: Types.ObjectId;

  approvedAt?: Date;
  createdBy?: Types.ObjectId;

  createdAt?: Date;
  updatedAt?: Date;
}
