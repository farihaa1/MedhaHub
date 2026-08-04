/* ============================================================
 * Category
 * ========================================================== */

export const QuestionBanksCategory = {
  BCS: "bcs",
  NTRCA: "ntrca",
  PSC_NON_CADRE: "psc-non-cadre",
  BANK: "bank",
  GOVERNMENT: "government",
  DEFENCE: "defence",
  HEALTH: "health",
  ADMISSION: "admission",
  TEACHER: "teacher",
  OTHERS: "others",
} as const;

export type TQuestionBanksCategory =
  (typeof QuestionBanksCategory)[keyof typeof QuestionBanksCategory];

/* ============================================================
 * Paper
 * ========================================================== */

export const QuestionBanksPaper = {
  PRELIMINARY: "PRELIMINARY",
  WRITTEN: "WRITTEN",
  VIVA: "VIVA",
  MODEL_TEST: "MODEL_TEST",
  PRACTICE: "PRACTICE",
} as const;

export type TQuestionBanksPaper =
  (typeof QuestionBanksPaper)[keyof typeof QuestionBanksPaper];

/* ============================================================
 * Visibility
 * ========================================================== */

export const QuestionBanksVisibility = {
  PUBLIC: "PUBLIC",
  PRIVATE: "PRIVATE",
} as const;

export type TQuestionBanksVisibility =
  (typeof QuestionBanksVisibility)[keyof typeof QuestionBanksVisibility];

/* ============================================================
 * Status
 * ========================================================== */

export const QuestionBanksStatus = {
  REVIEW: "REVIEW",
  PUBLISHED: "PUBLISHED",
  REJECTED: "REJECTED",
  ARCHIVED: "ARCHIVED",
} as const;

export type TQuestionBanksStatus =
  (typeof QuestionBanksStatus)[keyof typeof QuestionBanksStatus];

export const QUESTION_BANKS_CATEGORY = Object.values(QuestionBanksCategory);

export const QUESTION_BANKS_PAPER = Object.values(QuestionBanksPaper);

export const QUESTION_BANKS_STATUS = Object.values(QuestionBanksStatus);

export const QUESTION_BANKS_SEARCHABLE_FIELDS = [
  "title",
  "organization",
  "description",
  "category"
] ;

export const DEFAULT_QUESTION_BANKS_SORT = {
  year: -1,
  createdAt: -1,
} as const;
