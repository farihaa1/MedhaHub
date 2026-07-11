import { Types } from "mongoose";
import { TExamType } from "./examEngine.constant";

export interface IStartExamPayload {
  userId: string;

  examType: TExamType;

  subjectId?: string;

  chapterId?: string;

  topicIds?: string[];

  sourceId?: string;

  source?: string;

  year?: number;

  questionCount?: number;

  tags?: string[];
}

export interface IExamConfiguration {
  questions: Types.ObjectId[];

  duration: number;

  totalMarks: number;

  negativeMark: number;

  shuffleQuestions: boolean;

  shuffleOptions: boolean;
}
