import { IExamStrategy } from "./strategy.interface";

import { IStartExamPayload, IExamConfiguration } from "../examEngine.interface";
import { PracticeSet } from "../../PracticeSets/practiceSet.model";

export class PracticeSetStrategy implements IExamStrategy {
  async generateExam(payload: IStartExamPayload): Promise<IExamConfiguration> {
    if (!payload.sourceId) {
      throw new Error("Practice set id required");
    }

    const practiceSet = await PracticeSet.findById(payload.sourceId);

    if (!practiceSet) {
      throw new Error("Practice set not found");
    }

    return {
      questions: practiceSet.questions,

      duration: practiceSet.settings?.duration ?? practiceSet.questions.length,

      totalMarks: practiceSet.questions.length,

      negativeMark: practiceSet.settings?.negativeMark ?? 0,

      shuffleQuestions: practiceSet.settings?.shuffleQuestions ?? true,

      shuffleOptions: practiceSet.settings?.shuffleOptions ?? true,
    };
  }
}
