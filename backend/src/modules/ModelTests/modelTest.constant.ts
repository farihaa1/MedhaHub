export const ModelTestStatus = {
  DRAFT: "draft",
  PUBLISHED: "published",
} as const;

export type TModelTestStatus =
  (typeof ModelTestStatus)[keyof typeof ModelTestStatus];

export const ModelTestVisibility = {
  PUBLIC: "public",
  PRIVATE: "private",
} as const;

export type TModelTestVisibility =
  (typeof ModelTestVisibility)[keyof typeof ModelTestVisibility];
