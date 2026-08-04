import { Types } from "mongoose";

export enum TopicStatus {
  Draft = "draft",
  Approved = "approved",
}

export interface ITopic {
  _id: Types.ObjectId;
  chapterId: Types.ObjectId;
  subjectId: Types.ObjectId;
  title: string;
  slug: string;
  order: number;
  status: TopicStatus;
  totalQuestions: number;
}
