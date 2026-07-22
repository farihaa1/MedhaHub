import { z } from "zod";
import {
  QuestionDifficulty,
  QuestionSourceType,
  QuestionStatus,
  QuestionType,
} from "./question.constant";

/* ===========================
   Zod Enums
=========================== */

const QuestionTypeEnum = z.enum([QuestionType.MCQ]);

const QuestionDifficultyEnum = z.enum([
  QuestionDifficulty.EASY,
  QuestionDifficulty.MEDIUM,
  QuestionDifficulty.HARD,
]);

const QuestionStatusEnum = z.enum([
  QuestionStatus.PENDING,
  QuestionStatus.APPROVED,
  QuestionStatus.REJECTED,
]);

const QuestionSourceTypeEnum = z.enum([
  QuestionSourceType.BCS,
  QuestionSourceType.NTRCA,
  QuestionSourceType.PRIMARY,
  QuestionSourceType.BANK,
  QuestionSourceType.UNIVERSITY,
  QuestionSourceType.MEDICAL,
  QuestionSourceType.CUSTOM,
]);

/* ===========================
   Option Schema
=========================== */

const optionSchema = z.object({
  text: z.string().min(1, "Option text is required"),
  image: z.string().nullable().optional(),
  isCorrect: z.boolean(),
});

/* ===========================
   Source Schema
=========================== */

const sourceSchema = z.object({
  type: QuestionSourceTypeEnum,
  name: z.string().min(1, "Source name is required"),
  year: z.number().optional(),
});

/* ===========================
   Create Validation
=========================== */

const createQuestionValidationSchema = z.object({
  body: z.object({
    subject: z.string().min(1),
    chapter: z.string().min(1),
    topic: z.string().min(1),

    type: QuestionTypeEnum.optional(),


    questionText: z.string().min(5, "Question must be at least 5 characters"),

    questionImage: z.string().nullable().optional(),

    options: z
      .array(optionSchema)
      .length(4, "MCQ must contain exactly 4 options")
      .refine((options) => options.filter((o) => o.isCorrect).length === 1, {
        message: "Exactly one option must be correct",
      }),

    explanation: z.string().optional(),

    explanationImage: z.string().nullable().optional(),

    sources: z.array(sourceSchema).optional(),

    difficulty: QuestionDifficultyEnum.optional(),

    tags: z.array(z.string()).optional(),

    status: QuestionStatusEnum.optional(),

    createdBy: z.string().min(1),

    approvedBy: z.string().optional(),

    approvedAt: z.coerce.date().optional(),
  }),
});

/* ===========================
   Update Validation
=========================== */

const updateQuestionValidationSchema = z.object({
  body: z.object({
    subject: z.string().optional(),

    chapter: z.string().optional(),

    topic: z.string().optional(),

    type: QuestionTypeEnum.optional(),

   

    questionText: z.string().min(5).optional(),

    questionImage: z.string().nullable().optional(),

    options: z
      .array(optionSchema)
      .length(4)
      .refine((options) => options.filter((o) => o.isCorrect).length === 1, {
        message: "Exactly one option must be correct",
      })
      .optional(),

    explanation: z.string().optional(),

    explanationImage: z.string().nullable().optional(),

    sources: z.array(sourceSchema).optional(),

    difficulty: QuestionDifficultyEnum.optional(),

    tags: z.array(z.string()).optional(),

    status: QuestionStatusEnum.optional(),

    approvedBy: z.string().optional(),

    approvedAt: z.coerce.date().optional(),
  }),
});
const bulkCreateQuestionValidationSchema = z.object({
  body: z.array(createQuestionValidationSchema.shape.body).min(1),
});
export const QuestionValidation = {
  createQuestionValidationSchema,
  updateQuestionValidationSchema,bulkCreateQuestionValidationSchema
};
