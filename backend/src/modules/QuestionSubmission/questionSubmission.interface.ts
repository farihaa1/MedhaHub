import { Types } from "mongoose";
import {
  TSubmissionStatus,
  TSubmissionType,
} from "./questionSubmission.constant";

export interface IQuestionSubmission {
  _id: Types.ObjectId;

  submissionType?: TSubmissionType;

  /**
   * Required when submissionType === UPDATE
   */
  existingQuestionId?: Types.ObjectId;

  /**
   * Filled automatically after approval
   */
  approvedQuestionId?: Types.ObjectId;

  subjectId: Types.ObjectId;

  chapterId?: Types.ObjectId;
  suggestedChapterTitle?: string;

  topicId?: Types.ObjectId;
  suggestedTopicTitle?: string;

  questionText: string;

  options: {
    label: "A" | "B" | "C" | "D";
    text: string;
    image?: string;
  }[];

  correctAnswer: "A" | "B" | "C" | "D";

  explanation?: string;

  tags?: string[];

  status: TSubmissionStatus;

  submittedBy: Types.ObjectId;

  reviewedBy?: Types.ObjectId;

  reviewComment?: string;

  reviewedAt?: Date;

  createdAt?: Date;

  updatedAt?: Date;
}

export type TCreateSubmissionPayload = Omit<
  IQuestionSubmission,
  | "_id"
  | "approvedQuestionId"
  | "submittedBy"
  | "reviewedBy"
  | "reviewComment"
  | "reviewedAt"
  | "status"
  | "createdAt"
  | "updatedAt"
>;
