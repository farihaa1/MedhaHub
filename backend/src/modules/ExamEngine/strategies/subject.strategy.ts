import { IExamStrategy } from "./strategy.interface";

import { IStartExamPayload, IExamConfiguration } from "../examEngine.interface";

import { QuestionSelectorService } from "../services/questionSelector.service";

import { TimerService } from "../services/timer.service";

export class SubjectExamStrategy implements IExamStrategy {
  async generateExam(payload: IStartExamPayload): Promise<IExamConfiguration> {
    if (!payload.subjectId) {
      throw new Error("Subject required");
    }

    const questions = await QuestionSelectorService.selectQuestions({
      subjectId: payload.subjectId,

      count: payload.questionCount ?? 100,
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
