import { z } from "zod";

import {
  QUESTION_BANK_CATEGORY,
  QUESTION_BANK_PAPER,
  QUESTION_BANK_VISIBILITY,
} from "./questionBank.constant";

/* ============================================================
   Enums
============================================================ */

const CategoryEnum = z.enum([...QUESTION_BANK_CATEGORY] as [
  string,
  ...string[],
]);

const PaperEnum = z.enum([...QUESTION_BANK_PAPER] as [string, ...string[]]);

const VisibilityEnum = z.enum([...QUESTION_BANK_VISIBILITY] as [
  string,
  ...string[],
]);

/* ============================================================
   Create
============================================================ */

const createQuestionBankValidationSchema = z.object({
  body: z.object({
    title: z
      .string()
      .trim()
      .min(3, "Title must be at least 3 characters")
      .max(200),

    slug: z.string().trim().min(3).max(200).optional(),

    category: CategoryEnum,

    year: z.number().int().min(1900).max(2100).optional(),

    paper: PaperEnum.optional(),

    organization: z.string().trim().max(200).optional(),

    description: z.string().trim().max(2000).optional(),

    visibility: VisibilityEnum.optional(),

    isPublished: z.boolean().optional(),

    isPremium: z.boolean().optional(),
  }),
});

/* ============================================================
   Update
============================================================ */

const updateQuestionBankValidationSchema = z.object({
  body: z
    .object({
      title: z.string().trim().min(3).max(200).optional(),

      slug: z.string().trim().min(3).max(200).optional(),

      category: CategoryEnum.optional(),

      year: z.number().int().min(1900).max(2100).optional(),

      paper: PaperEnum.optional(),

      organization: z.string().trim().max(200).optional(),

      description: z.string().trim().max(2000).optional(),

      visibility: VisibilityEnum.optional(),

      isPublished: z.boolean().optional(),

      isPremium: z.boolean().optional(),
    })
    .strict(),
});

export const QuestionBankValidation = {
  createQuestionBankValidationSchema,
  updateQuestionBankValidationSchema,
};
