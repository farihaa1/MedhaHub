export const PracticeSetStatus = {
  DRAFT: "draft",
  PUBLISHED: "published",
} as const;

export type TPracticeSetStatus =
  (typeof PracticeSetStatus)[keyof typeof PracticeSetStatus];

export const PracticeSetVisibility = {
  PUBLIC: "public",
  PRIVATE: "private",
} as const;

export type TPracticeSetVisibility =
  (typeof PracticeSetVisibility)[keyof typeof PracticeSetVisibility];
