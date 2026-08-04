import { z } from "zod";
import {
  QuestionDifficulty,
  QuestionSourceType,
  QuestionStatus,
  QuestionType,
} from "./question.constant";

/* ==========================================================
   ENUMS
========================================================== */

const QuestionTypeEnum = z.nativeEnum(QuestionType);

const QuestionDifficultyEnum = z.nativeEnum(QuestionDifficulty);

const QuestionStatusEnum = z.nativeEnum(QuestionStatus);

const QuestionSourceTypeEnum = z.nativeEnum(QuestionSourceType);

/* ==========================================================
   OPTION
========================================================== */

const optionSchema = z.object({
  text: z.string().min(1, "Option text is required"),

  image: z.string().nullable().optional(),

  isCorrect: z.boolean(),
});

/* ==========================================================
   SOURCE
========================================================== */

const sourceSchema = z.object({
  type: QuestionSourceTypeEnum,

  name: z.string().min(1, "Source name is required"),

  year: z.number().optional(),
});

/* ==========================================================
   CREATE
========================================================== */

const createQuestionValidationSchema = z.object({
  body: z.object({
    subjectId: z.string().min(1),
    chapterId: z.string().min(1),
    topicId: z.string().min(1),
    type: QuestionTypeEnum.optional(),
    questionText: z.string().min(5, "Question must be at least 5 characters"),
    questionImage: z.string().nullable().optional(),
    options: z
      .array(optionSchema)
      .length(4, "MCQ must contain exactly four options")
      .refine((options) => options.filter((o) => o.isCorrect).length === 1, {
        message: "Exactly one option must be correct",
      }),

    explanation: z.string().optional(),

    explanationImage: z.string().nullable().optional(),

    difficulty: QuestionDifficultyEnum,

    marks: z.number().min(1).optional(),

    negativeMarks: z.number().min(0).optional(),

    tags: z.array(z.string()).optional(),

    sources: z.array(sourceSchema).optional(),

    status: QuestionStatusEnum.optional(),

    createdBy: z.string().optional(),

    approvedBy: z.string().optional(),

    approvedAt: z.coerce.date().optional(),
  }),
});

/* ==========================================================
   UPDATE
========================================================== */

const updateQuestionValidationSchema = z.object({
  body: z
    .object({
      subjectId: z.string().min(1).optional(),

      chapterId: z.string().min(1).optional(),

      topicId: z.string().min(1).optional(),

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

      difficulty: QuestionDifficultyEnum.optional(),

      marks: z.number().min(1).optional(),

      negativeMarks: z.number().min(0).optional(),

      tags: z.array(z.string()).optional(),

      sources: z.array(sourceSchema).optional(),

      status: QuestionStatusEnum.optional(),

      approvedBy: z.string().optional(),

      approvedAt: z.coerce.date().optional(),
    })
    .partial(),
});

/* ==========================================================
   BULK CREATE
========================================================== */

const bulkCreateQuestionValidationSchema = z.object({
  body: z.array(createQuestionValidationSchema.shape.body).min(1),
});

/* ==========================================================
   EXPORT
========================================================== */

export const QuestionValidation = {
  createQuestionValidationSchema,
  updateQuestionValidationSchema,
  bulkCreateQuestionValidationSchema,
};
