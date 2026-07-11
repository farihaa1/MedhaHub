import { Types } from "mongoose";
import { QuestionStatus } from "./question.constant";

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
  status: QuestionStatus;

  createdBy?: Types.ObjectId;

  createdAt?: Date;
  updatedAt?: Date;
}
