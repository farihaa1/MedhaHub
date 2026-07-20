export const QuestionBankCategory = {
  BCS: "BCS",
  PRIMARY: "PRIMARY",
  NTRCA: "NTRCA",
  BANK: "BANK",
  UNIVERSITY: "UNIVERSITY",
  CUSTOM: "CUSTOM",
} as const;

export const QuestionBankPaper = {
  PRELIMINARY: "PRELIMINARY",
  WRITTEN: "WRITTEN",
  VIVA: "VIVA",
} as const;

export const QuestionBankVisibility = {
  PUBLIC: "PUBLIC",
  PRIVATE: "PRIVATE",
} as const;

export const QUESTION_BANK_CATEGORY = Object.values(QuestionBankCategory);

export const QUESTION_BANK_PAPER = Object.values(QuestionBankPaper);

export const QUESTION_BANK_VISIBILITY = Object.values(QuestionBankVisibility);

export const QUESTION_BANK_SEARCHABLE_FIELDS = [
  "title",
  "organization",
  "description",
];
