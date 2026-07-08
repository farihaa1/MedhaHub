import { IExamStrategy } from "./strategy.interface";

import { IStartExamPayload, IExamConfiguration } from "../examEngine.interface";

import { QuestionSelectorService } from "../services/questionSelector.service";
import { TimerService } from "../services/timer.service";

export class TopicExamStrategy implements IExamStrategy {
  async generateExam(payload: IStartExamPayload): Promise<IExamConfiguration> {
    if (!payload.topicIds?.length) {
      throw new Error("Topic required");
    }

    const questions = await QuestionSelectorService.selectQuestions({
      topicIds: payload.topicIds,

      count: payload.questionCount ?? 20,
    });

    return {
      questions: questions.map((q) => q._id),

      duration: TimerService.calculateDuration(questions.length),

      totalMarks: questions.length,

      negativeMark: 0,

      shuffleQuestions: true,

      shuffleOptions: true,
    };
  }
}
