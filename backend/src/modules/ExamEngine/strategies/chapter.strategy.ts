import { IExamStrategy } from "./strategy.interface";

import { IStartExamPayload, IExamConfiguration } from "../examEngine.interface";

import { QuestionSelectorService } from "../services/questionSelector.service";

import { TimerService } from "../services/timer.service";

export class ChapterExamStrategy implements IExamStrategy {
  async generateExam(payload: IStartExamPayload): Promise<IExamConfiguration> {
    if (!payload.chapterId) {
      throw new Error("Chapter required");
    }

    const questions = await QuestionSelectorService.selectQuestions({
      chapterId: payload.chapterId,

      count: payload.questionCount ?? 50,
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
