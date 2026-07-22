import { Types } from "mongoose";

export enum TopicStatus {
  Draft = "draft",
  Approved = "approved",
}

export interface ITopic {
  _id: string;
  chapter: Types.ObjectId;
  subject: Types.ObjectId;
  title: string;
  slug: string;
  order: number;
  status: TopicStatus;
  totalQuestions: number;
}
