
import {
  DuplicateScope,
  DuplicateStatus,
} from "./duplicateDetector.types";


// ============================================================
// SCOPE LABELS
// ============================================================

export const DUPLICATE_SCOPE_LABELS: Record<
  DuplicateScope,
  string
> = {
  [DuplicateScope.GLOBAL]:
    "Global",

  [DuplicateScope.SUBJECT]:
    "Subject",

  [DuplicateScope.CHAPTER]:
    "Chapter",

  [DuplicateScope.TOPIC]:
    "Topic",

  [DuplicateScope.QUESTION_BANK]:
    "Question Bank",

  [DuplicateScope.MODEL_TEST]:
    "Model Test",
};


// ============================================================
// STATUS LABELS
// ============================================================

export const DUPLICATE_STATUS_LABELS: Record<
  DuplicateStatus,
  string
> = {
  [DuplicateStatus.PENDING]:
    "Pending",

  [DuplicateStatus.DUPLICATE]:
    "Duplicate",

  [DuplicateStatus.NOT_DUPLICATE]:
    "Not Duplicate",

  [DuplicateStatus.IGNORED]:
    "Ignored",
};


// ============================================================
// SIMILARITY OPTIONS
// ============================================================

export const SIMILARITY_OPTIONS = [
  {
    label: "70%+",
    value: 0.7,
  },

  {
    label: "80%+",
    value: 0.8,
  },

  {
    label: "85%+",
    value: 0.85,
  },

  {
    label: "90%+",
    value: 0.9,
  },

  {
    label: "95%+",
    value: 0.95,
  },

  {
    label: "100% Exact",
    value: 1,
  },
];
