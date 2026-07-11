import httpStatus from "http-status";

import AppError from "../../../error/AppError";

import { BaseExamStrategy } from "./base.strategy";

import { IExamStrategy } from "./strategy.interface";

import { IExamConfiguration, IStartExamPayload } from "../examEngine.interface";

import { QuestionSelectorService } from "../services/questionSelector.service";

export class TopicExamStrategy
  extends BaseExamStrategy
  implements IExamStrategy
{
  async generateExam(payload: IStartExamPayload): Promise<IExamConfiguration> {
    if (!payload.topicIds?.length) {
      throw new AppError(httpStatus.BAD_REQUEST, "Topic ids are required.");
    }

    const questions = await QuestionSelectorService.selectQuestions({
      topicIds: payload.topicIds,

      count: payload.questionCount ?? 20,
    });

    return this.buildConfiguration(questions.map((question) => question._id!));
  }
}
