import { IExamStrategy } from "./strategy.interface";
import { IExamConfiguration, IStartExamPayload } from "../examEngine.interface";
import { QuestionSelectorService } from "../services/questionSelector.service";

export class PreviousYearStrategy implements IExamStrategy {
  async generateExam(payload: IStartExamPayload): Promise<IExamConfiguration> {
    const questions = await QuestionSelectorService.selectQuestions({
      source: payload.source,
      year: payload.year,
      count: payload.questionCount ?? 200,
    });

    return {
      questions,
      duration: 200,
      totalMarks: questions.length,
      negativeMark: 0.25,
      shuffleQuestions: false,
      shuffleOptions: false,
    };
  }
}
