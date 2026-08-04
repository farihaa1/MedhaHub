import { z } from "zod";
import {
  PracticeSetStatus,
  PracticeSetVisibility,
} from "./practiceSet.constant";

const objectId = z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId");

const settingsSchema = z.object({
  duration: z.number().int().positive().optional(),

  negativeMark: z.number().min(0).optional(),

  shuffleQuestions: z.boolean().optional(),

  shuffleOptions: z.boolean().optional(),
});

export const createPracticeSetValidationSchema = z.object({
  body: z.object({
    title: z.string().trim().min(3).max(200),

    description: z.string().trim().optional(),

    subject: objectId,

    chapter: objectId.optional(),

    topics: z.array(objectId).optional(),

    questions: z
      .array(objectId)
      .min(1, "Practice set must contain at least one question."),

    settings: settingsSchema.optional(),

    visibility: z
      .enum(Object.values(PracticeSetVisibility) as [string, ...string[]])
      .default(PracticeSetVisibility.PUBLIC),

    isPremium: z.boolean().default(false),

    status: z
      .enum(Object.values(PracticeSetStatus) as [string, ...string[]])
      .default(PracticeSetStatus.DRAFT),

    tags: z.array(z.string().trim()).optional(),
  }),
});

export const updatePracticeSetValidationSchema = z.object({
  body: z.object({
    title: z.string().trim().min(3).max(200).optional(),

    description: z.string().trim().optional(),

    subject: objectId.optional(),

    chapter: objectId.optional(),

    topics: z.array(objectId).optional(),

    questions: z.array(objectId).min(1).optional(),

    settings: settingsSchema.partial().optional(),

    visibility: z
      .enum(Object.values(PracticeSetVisibility) as [string, ...string[]])
      .optional(),

    isPremium: z.boolean().optional(),

    status: z
      .enum(Object.values(PracticeSetStatus) as [string, ...string[]])
      .optional(),

    tags: z.array(z.string().trim()).optional(),
  }),
});
