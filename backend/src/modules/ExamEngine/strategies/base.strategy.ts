import { Types } from "mongoose";

import { IExamConfiguration, IStartExamPayload } from "../examEngine.interface";

import { TimerService } from "../services/timer.service";

export interface IExamStrategy {
  generateExam(payload: IStartExamPayload): Promise<IExamConfiguration>;
}
export abstract class BaseExamStrategy {
  protected buildConfiguration(
    questions: Types.ObjectId[],
    options?: Partial<IExamConfiguration>,
  ): IExamConfiguration {
    return {
      questions,

      duration:
        options?.duration ?? TimerService.calculateDuration(questions.length),

      totalMarks: options?.totalMarks ?? questions.length,

      negativeMark: options?.negativeMark ?? 0,

      shuffleQuestions: options?.shuffleQuestions ?? true,

      shuffleOptions: options?.shuffleOptions ?? true,
    };
  }
}
