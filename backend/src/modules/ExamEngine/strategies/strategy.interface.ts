import { IExamConfiguration, IStartExamPayload } from "../examEngine.interface";

export type ExamStrategy = (
  payload: IStartExamPayload,
) => Promise<IExamConfiguration>;
