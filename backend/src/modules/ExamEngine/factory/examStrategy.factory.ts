import httpStatus from "http-status";

import AppError from "../../../error/AppError";

import { ExamType, TExamType } from "../examEngine.constant";

import { ExamStrategy } from "../strategies/strategy.interface";

import { topicExamStrategy } from "../strategies/topic.strategy";

import { chapterExamStrategy } from "../strategies/chapter.strategy";

import { subjectExamStrategy } from "../strategies/subject.strategy";

import { practiceSetStrategy } from "../strategies/practiceSet.strategy";

import { modelTestStrategy } from "../strategies/modelTest.strategy";

import { previousYearStrategy } from "../strategies/previousYear.strategy";

import { dailyQuizStrategy } from "../strategies/dailyQuiz.strategy";

export const getExamStrategy = (type: TExamType): ExamStrategy => {
  switch (type) {
    case ExamType.TOPIC:
      return topicExamStrategy;

    case ExamType.CHAPTER:
      return chapterExamStrategy;

    case ExamType.SUBJECT:
      return subjectExamStrategy;

    case ExamType.PRACTICE_SET:
      return practiceSetStrategy;

    case ExamType.MODEL_TEST:
      return modelTestStrategy;

    case ExamType.PREVIOUS_YEAR:
      return previousYearStrategy;

    case ExamType.DAILY:
      return dailyQuizStrategy;

    default:
      throw new AppError(httpStatus.BAD_REQUEST, "Unsupported exam type.");
  }
};
