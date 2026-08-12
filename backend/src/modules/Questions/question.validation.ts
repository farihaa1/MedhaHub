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

  year: z.number().int().optional(),
});

/* ==========================================================
   CREATE QUESTION
========================================================== */

const createQuestionValidationSchema = z.object({
  body: z.object({
    /* -----------------------------------------
       Academic classification
    ----------------------------------------- */

    subjectId: z.string().min(1, "Subject is required"),

    chapterId: z.string().min(1, "Chapter is required"),

    topicId: z.string().min(1, "Topic is required"),

    /* -----------------------------------------
       Question
    ----------------------------------------- */

    type: QuestionTypeEnum.optional(),

    questionText: z
      .string()
      .min(5, "Question must be at least 5 characters")
      .trim(),

    questionImage: z.string().nullable().optional(),

    /* -----------------------------------------
       Options
    ----------------------------------------- */

    options: z
      .array(optionSchema)
      .length(4, "MCQ must contain exactly four options")
      .refine(
        (options) => options.filter((option) => option.isCorrect).length === 1,
        {
          message: "Exactly one option must be correct",
        },
      ),

    /* -----------------------------------------
       Explanation
    ----------------------------------------- */

    explanation: z.string().optional(),

    explanationImage: z.string().nullable().optional(),

    /* -----------------------------------------
       Metadata
    ----------------------------------------- */

    difficulty: QuestionDifficultyEnum,

    tags: z.array(z.string()).optional(),

    sources: z.array(sourceSchema).optional(),

    /* -----------------------------------------
       Workflow fields

       These are accepted by validation,
       but controller/service decides status.
    ----------------------------------------- */

    status: QuestionStatusEnum.optional(),

    createdBy: z.string().optional(),

    approvedBy: z.string().optional(),

    approvedAt: z.coerce.date().optional(),
  }),
});

/* ==========================================================
   UPDATE QUESTION
========================================================== */

const updateQuestionValidationSchema = z.object({
  body: z
    .object({
      /* -----------------------------------------
         Academic classification
      ----------------------------------------- */

      subjectId: z.string().min(1).optional(),

      chapterId: z.string().min(1).optional(),

      topicId: z.string().min(1).optional(),

      /* -----------------------------------------
         Question
      ----------------------------------------- */

      type: QuestionTypeEnum.optional(),

      questionText: z.string().min(5).trim().optional(),

      questionImage: z.string().nullable().optional(),

      /* -----------------------------------------
         Options
      ----------------------------------------- */

      options: z
        .array(optionSchema)
        .length(4, "MCQ must contain exactly four options")
        .refine(
          (options) =>
            options.filter((option) => option.isCorrect).length === 1,
          {
            message: "Exactly one option must be correct",
          },
        )
        .optional(),

      /* -----------------------------------------
         Explanation
      ----------------------------------------- */

      explanation: z.string().optional(),

      explanationImage: z.string().nullable().optional(),

      /* -----------------------------------------
         Metadata
      ----------------------------------------- */

      difficulty: QuestionDifficultyEnum.optional(),

      tags: z.array(z.string()).optional(),

      sources: z.array(sourceSchema).optional(),

      /* -----------------------------------------
         Workflow
      ----------------------------------------- */

      status: QuestionStatusEnum.optional(),

      approvedBy: z.string().optional(),

      approvedAt: z.coerce.date().optional(),
    })
    .partial(),
});

/* ==========================================================
   BULK CREATE QUESTIONS
========================================================== */

const bulkCreateQuestionValidationSchema = z.object({
  body: z
    .array(createQuestionValidationSchema.shape.body)
    .min(1, "At least one question is required"),
});

/* ==========================================================
   EXPORT
========================================================== */

export const QuestionValidation = {
  createQuestionValidationSchema,
  updateQuestionValidationSchema,
  bulkCreateQuestionValidationSchema,
};
