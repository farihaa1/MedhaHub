import { z } from "zod";
import { ModelTestStatus, ModelTestVisibility } from "./modelTest.constant";

const objectId = z.string().regex(/^[0-9a-fA-F]{24}$/);

const settingsSchema = z.object({
  duration: z.number().int().positive(),

  negativeMark: z.number().min(0).optional(),

  shuffleQuestions: z.boolean().optional(),

  shuffleOptions: z.boolean().optional(),
});

const scheduleSchema = z.object({
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
});

export const createModelTestValidationSchema = z.object({
  body: z.object({
    title: z.string().trim().min(3).max(200),

    description: z.string().trim().optional(),

    questions: z.array(objectId).min(1, "At least one question is required."),

    settings: settingsSchema,

    schedule: scheduleSchema.optional(),

    visibility: z
      .enum(Object.values(ModelTestVisibility) as [string, ...string[]])
      .default(ModelTestVisibility.PUBLIC),

    isPremium: z.boolean().default(false),

    status: z
      .enum(Object.values(ModelTestStatus) as [string, ...string[]])
      .default(ModelTestStatus.DRAFT),

    tags: z.array(z.string()).optional(),
  }),
});

export const updateModelTestValidationSchema = z.object({
  body: z
    .object({
      title: z.string().trim().min(3).max(200),

      description: z.string().trim(),

      questions: z.array(objectId).min(1),

      settings: settingsSchema.partial(),

      schedule: scheduleSchema,

      visibility: z.enum(
        Object.values(ModelTestVisibility) as [string, ...string[]],
      ),

      isPremium: z.boolean(),

      status: z.enum(Object.values(ModelTestStatus) as [string, ...string[]]),

      tags: z.array(z.string()),
    })
    .partial(),
});
