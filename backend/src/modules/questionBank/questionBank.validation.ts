import { z } from "zod";

import {
  QUESTION_BANK_CATEGORY,
  QUESTION_BANK_PAPER,
  QUESTION_BANK_VISIBILITY,
} from "./questionBank.constant";


const createQuestionBankValidationSchema = z.object({
  body: z.object({
    title: z.string({
      message: "Title is required",
    }),

    slug: z.string().optional(),

    category: z.string({
      message: "Category is required",
    }),

    year: z.number().optional(),

    paper: z.string().optional(),

    organization: z.string().optional(),

    description: z.string().optional(),

    visibility: z.string().optional(),

    isPublished: z.boolean().optional(),

    isPremium: z.boolean().optional(),
  }),
});


const updateQuestionBankValidationSchema = z.object({
  body: z.object({
    title: z.string().trim().min(3).max(200).optional(),

    slug: z.string().trim().min(3).max(200).optional(),

    category: z
      .enum([...QUESTION_BANK_CATEGORY] as [string, ...string[]])
      .optional(),

    year: z.number().int().positive().optional(),

    paper: z.enum([...QUESTION_BANK_PAPER] as [string, ...string[]]).optional(),

    organization: z.string().trim().max(200).optional(),

    description: z.string().trim().max(2000).optional(),

    visibility: z
      .enum([...QUESTION_BANK_VISIBILITY] as [string, ...string[]])
      .optional(),

    isPublished: z.boolean().optional(),

    isPremium: z.boolean().optional(),
  }),
});

export const QuestionBankValidation = {
  createQuestionBankValidationSchema,
  updateQuestionBankValidationSchema,
};
