import httpStatus from "http-status";

import AppError from "../../../error/AppError";

import { BaseExamStrategy } from "./base.strategy";

import { IExamStrategy } from "./strategy.interface";

import { IExamConfiguration, IStartExamPayload } from "../examEngine.interface";

import { QuestionSelectorService } from "../services/questionSelector.service";

export class ChapterExamStrategy
  extends BaseExamStrategy
  implements IExamStrategy
{
  async generateExam(payload: IStartExamPayload): Promise<IExamConfiguration> {
    if (!payload.chapterId) {
      throw new AppError(httpStatus.BAD_REQUEST, "Chapter id is required.");
    }

    const questions = await QuestionSelectorService.selectQuestions({
      chapterId: payload.chapterId,

      count: payload.questionCount ?? 50,
    });

    return this.buildConfiguration(questions.map((question) => question._id!));
  }
}
