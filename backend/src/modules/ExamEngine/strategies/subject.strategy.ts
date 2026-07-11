import httpStatus from "http-status";

import AppError from "../../../error/AppError";

import { BaseExamStrategy } from "./base.strategy";

import { IExamStrategy } from "./strategy.interface";

import { IExamConfiguration, IStartExamPayload } from "../examEngine.interface";

import { QuestionSelectorService } from "../services/questionSelector.service";

export class SubjectExamStrategy
  extends BaseExamStrategy
  implements IExamStrategy
{
  async generateExam(payload: IStartExamPayload): Promise<IExamConfiguration> {
    if (!payload.subjectId) {
      throw new AppError(httpStatus.BAD_REQUEST, "Subject id is required.");
    }

    const questions = await QuestionSelectorService.selectQuestions({
      subjectId: payload.subjectId,

      count: payload.questionCount ?? 100,
    });

    return this.buildConfiguration(questions.map((question) => question._id!));
  }
}
