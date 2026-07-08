import { IStartExamPayload, IExamConfiguration } from "../examEngine.interface";

export interface IExamStrategy {
  generateExam(payload: IStartExamPayload): Promise<IExamConfiguration>;
}
