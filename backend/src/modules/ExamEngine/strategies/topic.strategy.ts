import httpStatus from "http-status";

import AppError from "../../../error/AppError";

import { IStartExamPayload } from "../examEngine.interface";

import { buildExamConfiguration } from "./base.strategy";

import { QuestionSelectorService } from "../services/questionSelector.service";

export const topicExamStrategy = async (payload: IStartExamPayload) => {
  if (!payload.topicIds?.length) {
    throw new AppError(httpStatus.BAD_REQUEST, "Topic ids are required.");
  }

  const questions = await QuestionSelectorService.selectQuestions({
    topicIds: payload.topicIds,

    count: payload.questionCount ?? 20,
  });

  return buildExamConfiguration(questions.map((question) => question._id!));
};
