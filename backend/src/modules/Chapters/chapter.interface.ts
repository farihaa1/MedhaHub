import { Types } from "mongoose";
import { ChapterStatus } from "./chapter.constant";

export interface IChapter {
  subjectId: Types.ObjectId;
  title: string;
  slug: string;
  order: number;
  status: ChapterStatus;
  totalTopics: number;
  totalQuestions: number;
  progress: number;
  userId?: Types.ObjectId;
}
