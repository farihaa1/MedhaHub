import { TExamType, ExamType } from "../examEngine.constant";

import { IExamStrategy } from "../strategies/strategy.interface";

import { TopicExamStrategy } from "../strategies/topic.strategy";
import { ChapterExamStrategy } from "../strategies/chapter.strategy";
import { SubjectExamStrategy } from "../strategies/subject.strategy";
import { CustomExamStrategy } from "../strategies/custom.strategy";
import { PracticeSetStrategy } from "../strategies/practiceSet.strategy";
import { ModelTestStrategy } from "../strategies/modelTest.strategy";
import { DailyQuizStrategy } from "../strategies/dailyQuiz.strategy";
import { PreviousYearStrategy } from "../strategies/previousYear.strategy";

export const getExamStrategy = (examType: TExamType): IExamStrategy => {
  switch (examType) {
    case ExamType.TOPIC:
      return new TopicExamStrategy();

    case ExamType.CHAPTER:
      return new ChapterExamStrategy();

    case ExamType.SUBJECT:
      return new SubjectExamStrategy();

    case ExamType.CUSTOM:
      return new CustomExamStrategy();

    case ExamType.PRACTICE_SET:
      return new PracticeSetStrategy();

    case ExamType.MODEL_TEST:
      return new ModelTestStrategy();

    case ExamType.DAILY:
      return new DailyQuizStrategy();

    case ExamType.PREVIOUS_YEAR:
      return new PreviousYearStrategy();

    default:
      throw new Error("Unsupported exam type");
  }
};
