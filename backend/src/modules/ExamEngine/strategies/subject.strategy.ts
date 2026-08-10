import httpStatus from "http-status";

import AppError from "../../../error/AppError";

import { IStartExamPayload } from "../examEngine.interface";

import { buildExamConfiguration } from "./base.strategy";

import { QuestionSelectorService } from "../services/questionSelector.service";

export const subjectExamStrategy = async (payload: IStartExamPayload) => {
  if (!payload.subjectId) {
    throw new AppError(httpStatus.BAD_REQUEST, "Subject id is required.");
  }

  const questions = await QuestionSelectorService.selectQuestions({
    subjectId: payload.subjectId,

    count: payload.questionCount ?? 100,
  });

  return buildExamConfiguration(questions.map((question) => question._id!));
};
