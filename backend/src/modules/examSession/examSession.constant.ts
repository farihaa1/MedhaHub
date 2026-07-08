export const ExamSessionStatus = {
  NOT_STARTED: "not_started",
  RUNNING: "running",
  SUBMITTED: "submitted",
  EXPIRED: "expired",
  CANCELLED : "cancelled",
} as const;

export type TExamSessionStatus =
  (typeof ExamSessionStatus)[keyof typeof ExamSessionStatus];
