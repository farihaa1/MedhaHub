export interface AIRepairOption {
  label: "A" | "B" | "C" | "D";

  text: string;

  isCorrect: boolean;
}

export interface AIRepairQuestion {
  question: string;

  options: AIRepairOption[];

  answer?: "A" | "B" | "C" | "D";

  explanation: string;

  difficulty: "EASY" | "MEDIUM" | "HARD";

  tags: string[];
}
