import { IExamStrategy } from "./strategy.interface";

import { IStartExamPayload, IExamConfiguration } from "../examEngine.interface";
import { ModelTest } from "../../ModelTests/modelTest.model";
import { isModelTestAvailable } from "../../ModelTests/modelTest.utils";

export class ModelTestStrategy implements IExamStrategy {
  async generateExam(payload: IStartExamPayload): Promise<IExamConfiguration> {
    if (!payload.sourceId) {
      throw new Error("Model test id required");
    }

    const modelTest = await ModelTest.findById(payload.sourceId);

    if (!modelTest) {
      throw new Error("Model test not found");
    }

    const available = isModelTestAvailable(
      modelTest.schedule?.startDate,
      modelTest.schedule?.endDate,
    );

    if (!available) {
      throw new Error("Model test is not available");
    }

    return {
      questions: modelTest.questions,

      duration: modelTest.settings.duration,

      totalMarks: modelTest.questions.length,

      negativeMark: modelTest.settings.negativeMark ?? 0,

      shuffleQuestions: modelTest.settings.shuffleQuestions ?? false,

      shuffleOptions: modelTest.settings.shuffleOptions ?? false,
    };
  }
}
