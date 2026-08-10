import httpStatus from "http-status";

import AppError from "../../../error/AppError";

import { PracticeSet } from "../../PracticeSets/practiceSet.model";

import { IStartExamPayload } from "../examEngine.interface";

import { buildExamConfiguration } from "./base.strategy";

export const practiceSetStrategy = async (payload: IStartExamPayload) => {
  if (!payload.sourceId) {
    throw new AppError(httpStatus.BAD_REQUEST, "Practice Set id is required.");
  }

  const practiceSet = await PracticeSet.findById(payload.sourceId);

  if (!practiceSet) {
    throw new AppError(httpStatus.NOT_FOUND, "Practice Set not found.");
  }

  return buildExamConfiguration(practiceSet.questions, {
    duration: practiceSet.settings?.duration,

    negativeMark: practiceSet.settings?.negativeMark,

    shuffleQuestions: practiceSet.settings?.shuffleQuestions,

    shuffleOptions: practiceSet.settings?.shuffleOptions,
  });
};
