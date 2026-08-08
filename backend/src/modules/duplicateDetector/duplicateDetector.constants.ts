export enum DuplicateStatus {
  PENDING = "pending",
  DUPLICATE = "duplicate",
  NOT_DUPLICATE = "not_duplicate",
  IGNORED = "ignored",
}

export enum DuplicateScope {
  GLOBAL = "global",
  SUBJECT = "subject",
  CHAPTER = "chapter",
  TOPIC = "topic",
  QUESTION_BANK = "question_bank",
  MODEL_TEST = "model_test",
}

export const DUPLICATE_CONFIG = {
  DEFAULT_THRESHOLD: 0.7,
  HIGH_THRESHOLD: 0.9,
  VERY_HIGH_THRESHOLD: 0.95,

  NGRAM_SIZE: 3,

  MAX_CANDIDATES: 200,

  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
};
