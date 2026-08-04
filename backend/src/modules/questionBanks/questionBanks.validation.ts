import { z } from "zod";

import {
  QUESTION_BANKS_CATEGORY,
  QUESTION_BANKS_PAPER,
  QUESTION_BANKS_STATUS,
  QuestionBanksStatus,
  QuestionBanksVisibility,
} from "./questionBanks.constant";

/* ============================================================
 * Enums
 * ========================================================== */

const CategoryEnum = z.enum([...QUESTION_BANKS_CATEGORY] as [
  string,
  ...string[],
]);

const PaperEnum = z.enum([...QUESTION_BANKS_PAPER] as [string, ...string[]]);

const StatusEnum = z.enum([...QUESTION_BANKS_STATUS] as [string, ...string[]]);

const VisibilityEnum = z.nativeEnum(QuestionBanksVisibility);

/* ============================================================
 * Base Schema
 * ========================================================== */

const QuestionBankSchema = z.object({
  title: z.string().trim().min(3).max(200),

  description: z.string().trim().max(3000).optional(),

  category: CategoryEnum,

  organization: z.string().trim().max(200).optional(),

  year: z.number().int().min(1900).max(2100).optional(),

  paper: PaperEnum.optional(),

  visibility: VisibilityEnum.optional(),

  isPremium: z.boolean().optional(),

  slug: z
    .string()
    .trim()
    .min(3)
    .max(200)
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug must contain only lowercase letters, numbers and hyphens",
    )
    .optional(),

  status: StatusEnum.optional(),

  reviewRemark: z.string().trim().max(1000).optional(),
});

/* ============================================================
 * Create
 * ========================================================== */

export const createQuestionBanksValidationSchema = z.object({
  body: QuestionBankSchema,
});

/* ============================================================
 * Bulk Create
 * ========================================================== */

export const bulkCreateQuestionBanksValidationSchema = z.object({
  body: z.array(QuestionBankSchema).min(1),
});

/* ============================================================
 * Update
 * ========================================================== */

export const updateQuestionBanksValidationSchema = z.object({
  body: QuestionBankSchema.partial(),
});

/* ============================================================
 * Publish
 * ========================================================== */

export const publishQuestionBankValidationSchema = z.object({
  body: z.object({
    slug: z
      .string()
      .trim()
      .min(3)
      .max(200)
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Invalid slug format"),

    status: z.literal(QuestionBanksStatus.PUBLISHED),
  }),
});

/* ============================================================
 * Reject
 * ========================================================== */

export const rejectQuestionBankValidationSchema = z.object({
  body: z.object({
    reviewRemark: z.string().trim().min(3).max(1000),

    status: z.literal(QuestionBanksStatus.REJECTED),
  }),
});

/* ============================================================
 * Archive
 * ========================================================== */

export const archiveQuestionBankValidationSchema = z.object({
  body: z.object({
    status: z.literal(QuestionBanksStatus.ARCHIVED),
  }),
});

/* ============================================================
 * Restore
 * ========================================================== */

export const restoreQuestionBankValidationSchema = z.object({
  body: z.object({
    status: z.literal(QuestionBanksStatus.PUBLISHED),
  }),
});

/* ============================================================
 * Export
 * ========================================================== */

export const QuestionBanksValidation = {
  createQuestionBanksValidationSchema,
  bulkCreateQuestionBanksValidationSchema,
  updateQuestionBanksValidationSchema,
  publishQuestionBankValidationSchema,
  rejectQuestionBankValidationSchema,
  archiveQuestionBankValidationSchema,
  restoreQuestionBankValidationSchema,
};
