import { IStartExamPayload } from "../examEngine.interface";

import { buildExamConfiguration } from "./base.strategy";

import { QuestionSelectorService } from "../services/questionSelector.service";

export const previousYearStrategy = async (payload: IStartExamPayload) => {
  const questions = await QuestionSelectorService.selectQuestions({
    source: payload.source,

    year: payload.year,

    count: payload.questionCount ?? 200,
  });

  return buildExamConfiguration(
    questions.map((question) => question._id!),
    {
      duration: 200,

      negativeMark: 0.25,

      shuffleQuestions: false,

      shuffleOptions: false,
    },
  );
};
