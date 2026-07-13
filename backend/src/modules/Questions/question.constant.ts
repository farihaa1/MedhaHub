export const QuestionStatus = {
  PENDING: "PENDING",
  APPROVED: "APPROVED",
  REJECTED: "REJECTED",
} as const;

export type TQuestionStatus =
  (typeof QuestionStatus)[keyof typeof QuestionStatus];
