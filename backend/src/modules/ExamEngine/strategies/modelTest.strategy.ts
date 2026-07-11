import httpStatus from "http-status";

import AppError from "../../../error/AppError";

import { BaseExamStrategy } from "./base.strategy";
import { IExamStrategy } from "./strategy.interface";

import { IExamConfiguration, IStartExamPayload } from "../examEngine.interface";

import { ModelTest } from "../../ModelTests/modelTest.model";
import { isModelTestAvailable } from "../../ModelTests/modelTest.utils";

export class ModelTestStrategy
  extends BaseExamStrategy
  implements IExamStrategy
{
  async generateExam(payload: IStartExamPayload): Promise<IExamConfiguration> {
    if (!payload.sourceId) {
      throw new AppError(httpStatus.BAD_REQUEST, "Model Test id is required.");
    }

    const modelTest = await ModelTest.findById(payload.sourceId);

    if (!modelTest) {
      throw new AppError(httpStatus.NOT_FOUND, "Model Test not found.");
    }

    const available = isModelTestAvailable(
      modelTest.schedule?.startDate,
      modelTest.schedule?.endDate,
    );

    if (!available) {
      throw new AppError(httpStatus.BAD_REQUEST, "Model Test is unavailable.");
    }

    return this.buildConfiguration(modelTest.questions, {
      duration: modelTest.settings.duration,

      negativeMark: modelTest.settings.negativeMark,

      shuffleQuestions: modelTest.settings.shuffleQuestions,

      shuffleOptions: modelTest.settings.shuffleOptions,
    });
  }
}
