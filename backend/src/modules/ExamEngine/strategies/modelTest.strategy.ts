import httpStatus from "http-status";

import AppError from "../../../error/AppError";

import { ModelTest } from "../../ModelTests/modelTest.model";

import { isModelTestAvailable } from "../../ModelTests/modelTest.utils";

import { IStartExamPayload } from "../examEngine.interface";

import { buildExamConfiguration } from "./base.strategy";

export const modelTestStrategy = async (payload: IStartExamPayload) => {
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

  return buildExamConfiguration(modelTest.questions, {
    duration: modelTest.settings.duration,

    negativeMark: modelTest.settings.negativeMark,

    shuffleQuestions: modelTest.settings.shuffleQuestions,

    shuffleOptions: modelTest.settings.shuffleOptions,
  });
};
