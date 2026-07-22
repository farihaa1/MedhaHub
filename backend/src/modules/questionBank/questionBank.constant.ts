export const QuestionBankCategory = {
  BCS: "BCS",
  PRIMARY: "PRIMARY",
  NTRCA: "NTRCA",
  BANK: "BANK",
  UNIVERSITY: "UNIVERSITY",
  MEDICAL: "MEDICAL",
  CUSTOM: "CUSTOM",
} as const;

export type TQuestionBankCategory =
  (typeof QuestionBankCategory)[keyof typeof QuestionBankCategory];

export const QuestionBankPaper = {
  PRELIMINARY: "PRELIMINARY",
  WRITTEN: "WRITTEN",
  VIVA: "VIVA",
} as const;

export type TQuestionBankPaper =
  (typeof QuestionBankPaper)[keyof typeof QuestionBankPaper];

export const QuestionBankVisibility = {
  PUBLIC: "PUBLIC",
  PRIVATE: "PRIVATE",
} as const;

export type TQuestionBankVisibility =
  (typeof QuestionBankVisibility)[keyof typeof QuestionBankVisibility];

export const QUESTION_BANK_CATEGORY = Object.values(QuestionBankCategory);

export const QUESTION_BANK_PAPER = Object.values(QuestionBankPaper);

export const QUESTION_BANK_VISIBILITY = Object.values(QuestionBankVisibility);

export const QUESTION_BANK_SEARCHABLE_FIELDS = [
  "title",
  "organization",
  "description",
];
