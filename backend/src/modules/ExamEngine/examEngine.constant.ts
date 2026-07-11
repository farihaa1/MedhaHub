export const ExamType = {
  TOPIC: "topic",
  CHAPTER: "chapter",
  SUBJECT: "subject",
  PRACTICE_SET: "practice_set",
  MODEL_TEST: "model_test",
  PREVIOUS_YEAR: "previous_year",
  DAILY: "daily",
} as const;

export type TExamType = (typeof ExamType)[keyof typeof ExamType];
