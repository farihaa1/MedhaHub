import { z } from "zod";

const addQuestion = z.object({
  body: z.object({
    question: z.string(),

    order: z.number().int().optional(),

    marks: z.number().optional(),

    negativeMarks: z.number().optional(),
  }),
});

const bulkAddQuestions = z.object({
  body: z.object({
    questionIds: z.array(z.string()).min(1),
  }),
});

const reorderQuestions = z.object({
  body: z.object({
    items: z.array(
      z.object({
        id: z.string(),
        order: z.number().int().min(1),
      }),
    ),
  }),
});

const updateQuestionBankItem = z.object({
  body: z.object({
    order: z.number().int().optional(),

    marks: z.number().optional(),

    negativeMarks: z.number().optional(),

    isActive: z.boolean().optional(),
  }),
});

export const QuestionBankItemValidation = {
  addQuestion,
  bulkAddQuestions,
  reorderQuestions,
  updateQuestionBankItem,
};
