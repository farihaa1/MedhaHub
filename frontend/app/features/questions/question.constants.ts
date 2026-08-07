/* ==========================================================
   QUESTION STATUS
========================================================== */

export const QuestionStatus = {
  PENDING: "PENDING",
  APPROVED: "APPROVED",
  REJECTED: "REJECTED",
} as const

export type TQuestionStatus =
  (typeof QuestionStatus)[keyof typeof QuestionStatus]

/* ==========================================================
   QUESTION TYPE
========================================================== */

export const QuestionType = {
  MCQ: "MCQ",
} as const

export type TQuestionType = (typeof QuestionType)[keyof typeof QuestionType]

/* ==========================================================
   QUESTION DIFFICULTY
========================================================== */

export const QuestionDifficulty = {
  EASY: "EASY",
  MEDIUM: "MEDIUM",
  HARD: "HARD",
} as const

export type TQuestionDifficulty =
  (typeof QuestionDifficulty)[keyof typeof QuestionDifficulty]

/* ==========================================================
   QUESTION SOURCE
========================================================== */

export const QuestionSourceType = {
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
  CUSTOM: "custom",
  PDF_IMPORT: "pdf-import",
} as const

export type TQuestionSourceType =
  (typeof QuestionSourceType)[keyof typeof QuestionSourceType]

/* ==========================================================
   OPTIONS
========================================================== */

export const QUESTION_STATUS_OPTIONS = Object.entries(QuestionStatus).map(
  ([label, value]) => ({
    label,
    value,
  })
)

export const QUESTION_TYPE_OPTIONS = Object.entries(QuestionType).map(
  ([label, value]) => ({
    label,
    value,
  })
)

export const QUESTION_DIFFICULTY_OPTIONS = Object.entries(
  QuestionDifficulty
).map(([label, value]) => ({
  label,
  value,
}))

export const QUESTION_SOURCE_OPTIONS = Object.entries(QuestionSourceType).map(
  ([label, value]) => ({
    label: label.replace(/_/g, " "),
    value,
  })
)
