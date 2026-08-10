import { IStartExamPayload } from "../examEngine.interface";

import { buildExamConfiguration } from "./base.strategy";

import { QuestionSelectorService } from "../services/questionSelector.service";

export const dailyQuizStrategy = async (_payload: IStartExamPayload) => {
  const questions = await QuestionSelectorService.selectQuestions({
    count: 10,
  });

  return buildExamConfiguration(
    questions.map((question) => question._id!),
    {
      duration: 10,
    },
  );
};
