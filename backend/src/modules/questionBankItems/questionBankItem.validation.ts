import { z } from "zod";

/* ======================================================
   Add Single Question
====================================================== */

const addQuestionValidationSchema = z.object({
  body: z.object({
    question: z.string().min(1, "Question id is required"),

    order: z.number().int().min(1).optional(),

    marks: z.number().min(0).optional(),

    negativeMarks: z.number().min(0).optional(),
  }),
});

/* ======================================================
   Bulk Add Questions
====================================================== */

const bulkAddQuestionsValidationSchema = z.object({
  body: z.object({
    questionIds: z
      .array(z.string().min(1))
      .min(1, "At least one question is required"),
  }),
});

/* ======================================================
   Reorder Questions
====================================================== */

const reorderQuestionsValidationSchema = z.object({
  body: z.object({
    items: z
      .array(
        z.object({
          id: z.string().min(1),

          order: z.number().int().min(1),
        }),
      )
      .min(1),
  }),
});

/* ======================================================
   Update Question Bank Item
====================================================== */

const updateQuestionBankItemValidationSchema = z.object({
  body: z
    .object({
      order: z.number().int().min(1).optional(),

      marks: z.number().min(0).optional(),

      negativeMarks: z.number().min(0).optional(),

      isActive: z.boolean().optional(),
    })
    .strict(),
});

/* ======================================================
   Export
====================================================== */

export const QuestionBankItemValidation = {
  addQuestionValidationSchema,
  bulkAddQuestionsValidationSchema,
  reorderQuestionsValidationSchema,
  updateQuestionBankItemValidationSchema,
};
