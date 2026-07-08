export type TExamType = (typeof ExamType)[keyof typeof ExamType];

export const ExamSessionStatus = {
  NOT_STARTED: "not_started",
  RUNNING: "running",
  SUBMITTED: "submitted",
  EXPIRED: "expired",
} as const;

export type TExamSessionStatus =
  (typeof ExamSessionStatus)[keyof typeof ExamSessionStatus];

export const QuestionSelectionMode = {
  FIXED: "fixed",
  RANDOM: "random",
} as const;

export type TQuestionSelectionMode =
  (typeof QuestionSelectionMode)[keyof typeof QuestionSelectionMode];

export const DefaultExamSettings = {
  NEGATIVE_MARK: 0,
  SHUFFLE_QUESTIONS: true,
  SHUFFLE_OPTIONS: true,
  MINIMUM_QUESTION_COUNT: 1,
} as const;
export const ExamType = {
  SUBJECT: "subject",
  CHAPTER: "chapter",
  TOPIC: "topic",
  CUSTOM: "custom",
  PRACTICE_SET: "practice_set",
  MODEL_TEST: "model_test",
  DAILY: "daily",
  PREVIOUS_YEAR: "previous_year",
} as const;
