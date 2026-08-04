import { QuestionStatus } from "../../Questions/question.constant";

export interface IExamQuestionDTO {
  id: string;

  questionText: string;

  options: {
    _id: string;

    label: "A" | "B" | "C" | "D";

    text: string;

    image?: string | null;

    isCorrect?: boolean;
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
