import { BaseExamStrategy } from "./base.strategy";

import { IExamStrategy } from "./strategy.interface";

import { IExamConfiguration, IStartExamPayload } from "../examEngine.interface";

import { QuestionSelectorService } from "../services/questionSelector.service";

export class DailyQuizStrategy
  extends BaseExamStrategy
  implements IExamStrategy
{
  async generateExam(_payload: IStartExamPayload): Promise<IExamConfiguration> {
    const questions = await QuestionSelectorService.selectQuestions({
      count: 10,
    });

    return this.buildConfiguration(
      questions.map((q) => q._id!),
      {
        duration: 10,
      },
    );
  }
}
