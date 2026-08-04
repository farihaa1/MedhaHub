export interface IReviewOption {
  label: "A" | "B" | "C" | "D";
  text: string;
  isCorrect: boolean;
}

export interface IReviewQuestion {
  id: string;
  order: number;

  questionText: string;

  options: IReviewOption[];

  selectedOption?: "A" | "B" | "C" | "D";

  correctOption: "A" | "B" | "C" | "D";

  isCorrect: boolean;

  explanation?: string;
}

export interface IResultReviewDTO {
  result: {
    totalQuestions: number;
    attempted: number;
    correct: number;
    wrong: number;
    skipped: number;
    score: number;
    accuracy: number;
    negativeMark: number;
  };

  questions: IReviewQuestion[];
}
