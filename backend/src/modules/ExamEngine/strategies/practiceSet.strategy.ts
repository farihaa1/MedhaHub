import httpStatus from "http-status";

import AppError from "../../../error/AppError";

import { BaseExamStrategy } from "./base.strategy";
import { IExamStrategy } from "./strategy.interface";

import { IExamConfiguration, IStartExamPayload } from "../examEngine.interface";

import { PracticeSet } from "../../PracticeSets/practiceSet.model";

export class PracticeSetStrategy
  extends BaseExamStrategy
  implements IExamStrategy
{
  async generateExam(payload: IStartExamPayload): Promise<IExamConfiguration> {
    if (!payload.sourceId) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "Practice Set id is required.",
      );
    }

    const practiceSet = await PracticeSet.findById(payload.sourceId);

    if (!practiceSet) {
      throw new AppError(httpStatus.NOT_FOUND, "Practice Set not found.");
    }

    return this.buildConfiguration(practiceSet.questions, {
      duration: practiceSet.settings?.duration,

      negativeMark: practiceSet.settings?.negativeMark,

      shuffleQuestions: practiceSet.settings?.shuffleQuestions,

      shuffleOptions: practiceSet.settings?.shuffleOptions,
    });
  }
}
