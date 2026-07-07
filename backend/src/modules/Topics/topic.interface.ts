import { Types } from "mongoose";

export type TopicStatus = "draft" | "approved";

export interface ITopic {
  chapterId: Types.ObjectId;
  title: string;
  slug: string;
  order: number;
  status: TopicStatus;
  totalQuestions: number;
}
