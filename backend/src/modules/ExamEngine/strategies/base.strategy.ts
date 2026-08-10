import { Types } from "mongoose";

import { IExamConfiguration } from "../examEngine.interface";

import { TimerService } from "../services/timer.service";

export interface IExamConfigurationOptions {
  duration?: number;

  totalMarks?: number;

  negativeMark?: number;

  shuffleQuestions?: boolean;

  shuffleOptions?: boolean;
}

export const buildExamConfiguration = (
  questions: Types.ObjectId[],
  options?: IExamConfigurationOptions,
): IExamConfiguration => {
  return {
    questions,

    duration:
      options?.duration ?? TimerService.calculateDuration(questions.length),

    totalMarks: options?.totalMarks ?? questions.length,

    negativeMark: options?.negativeMark ?? 0,

    shuffleQuestions: options?.shuffleQuestions ?? true,

    shuffleOptions: options?.shuffleOptions ?? true,
  };
};
