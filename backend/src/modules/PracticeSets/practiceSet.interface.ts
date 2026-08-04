import { Types } from "mongoose";
import {
  TPracticeSetStatus,
  TPracticeSetVisibility,
} from "./practiceSet.constant";

export interface IPracticeSet {
  title: string;
  slug: string;
  description?: string;
  subject: Types.ObjectId;
  chapter?: Types.ObjectId;
  topics?: Types.ObjectId[];
  questions: Types.ObjectId[];
  settings?: {
    duration?: number;
    negativeMark?: number;
    shuffleQuestions?: boolean;
    shuffleOptions?: boolean;
  };

  visibility: TPracticeSetVisibility;
  isPremium: boolean;
  status: TPracticeSetStatus;
  tags?: string[];
  createdBy: Types.ObjectId;
  updatedBy?: Types.ObjectId;
}
