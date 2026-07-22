export const QuestionStatus = {
  PENDING: "PENDING",
  APPROVED: "APPROVED",
  REJECTED: "REJECTED",
} as const;

export type TQuestionStatus =
  (typeof QuestionStatus)[keyof typeof QuestionStatus];

export const QuestionType = {
  MCQ: "MCQ",
} as const;

export type TQuestionType = (typeof QuestionType)[keyof typeof QuestionType];


export const QuestionDifficulty = {
  EASY: "EASY",
  MEDIUM: "MEDIUM",
  HARD: "HARD",
} as const;

export type TQuestionDifficulty =
  (typeof QuestionDifficulty)[keyof typeof QuestionDifficulty];

export const QuestionSourceType = {
  BCS: "BCS",
  NTRCA: "NTRCA",
  PRIMARY: "PRIMARY",
  BANK: "BANK",
  UNIVERSITY: "UNIVERSITY",
  MEDICAL: "MEDICAL",
  CUSTOM: "CUSTOM",
} as const;

export type TQuestionSourceType =
  (typeof QuestionSourceType)[keyof typeof QuestionSourceType];
