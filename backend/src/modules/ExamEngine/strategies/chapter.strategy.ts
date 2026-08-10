import httpStatus from "http-status";

import AppError from "../../../error/AppError";

import { IStartExamPayload } from "../examEngine.interface";

import { buildExamConfiguration } from "./base.strategy";

import { QuestionSelectorService } from "../services/questionSelector.service";

export const chapterExamStrategy = async (payload: IStartExamPayload) => {
  if (!payload.chapterId) {
    throw new AppError(httpStatus.BAD_REQUEST, "Chapter id is required.");
  }

  const questions = await QuestionSelectorService.selectQuestions({
    chapterId: payload.chapterId,

    count: payload.questionCount ?? 50,
  });

  return buildExamConfiguration(questions.map((question) => question._id!));
};
