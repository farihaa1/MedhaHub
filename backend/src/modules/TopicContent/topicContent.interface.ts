import { Types } from "mongoose";

export type TopicContentStatus = "draft" | "published";

export interface ITopicContent {
  _id: Types.ObjectId;

  topicId: Types.ObjectId;

  bullets: string[];

  status: TopicContentStatus;

  createdBy?: Types.ObjectId;

  updatedBy?: Types.ObjectId;
}
