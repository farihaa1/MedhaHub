import httpStatus from "http-status";

import AppError from "../../../error/AppError";

import { ExamType, TExamType } from "../examEngine.constant";

import { IExamStrategy } from "../strategies/strategy.interface";

import { TopicExamStrategy } from "../strategies/topic.strategy";
import { ChapterExamStrategy } from "../strategies/chapter.strategy";
import { SubjectExamStrategy } from "../strategies/subject.strategy";
import { PracticeSetStrategy } from "../strategies/practiceSet.strategy";
import { ModelTestStrategy } from "../strategies/modelTest.strategy";
import { PreviousYearStrategy } from "../strategies/previousYear.strategy";
import { DailyQuizStrategy } from "../strategies/dailyQuiz.strategy";

export const getExamStrategy = (type: TExamType): IExamStrategy => {
  switch (type) {
    case ExamType.TOPIC:
      return new TopicExamStrategy();

    case ExamType.CHAPTER:
      return new ChapterExamStrategy();

    case ExamType.SUBJECT:
      return new SubjectExamStrategy();

    case ExamType.PRACTICE_SET:
      return new PracticeSetStrategy();

    case ExamType.MODEL_TEST:
      return new ModelTestStrategy();

    case ExamType.PREVIOUS_YEAR:
      return new PreviousYearStrategy();

    case ExamType.DAILY:
      return new DailyQuizStrategy();

    default:
      throw new AppError(httpStatus.BAD_REQUEST, "Unsupported exam type.");
  }
};
