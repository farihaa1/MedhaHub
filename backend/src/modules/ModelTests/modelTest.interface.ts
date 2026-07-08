import { Types } from "mongoose";
import { TModelTestStatus, TModelTestVisibility } from "./modelTest.constant";

export interface IModelTest {
  title: string;
  slug: string;
  description?: string;

  questions: Types.ObjectId[];

  settings: {
    duration: number;
    negativeMark?: number;
    shuffleQuestions?: boolean;
    shuffleOptions?: boolean;
  };

  schedule?: {
    startDate?: Date;
    endDate?: Date;
  };

  visibility: TModelTestVisibility;

  isPremium: boolean;

  status: TModelTestStatus;

  tags?: string[];

  createdBy: Types.ObjectId;
  updatedBy?: Types.ObjectId;
}
