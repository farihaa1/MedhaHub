import { QuestionStatus } from "../../Questions/question.constant";

export interface IExamQuestionDTO {
  id: string;
  questionText: string;
  options: {
    label: "A" | "B" | "C" | "D";
    text: string;
  }[];
  explanation?: string;
}

export interface IExamSessionQuestionDTO {
  order: number;
  question: IExamQuestionDTO;
}

export interface IExamSessionDTO {
  id: string;
  status: string;

  duration: number;
  remainingTime: number;

  questions: IExamSessionQuestionDTO[];
}
