import { z } from "zod";
import { QuestionStatus } from "./question.constant";

const optionsSchema = z
  .array(
    z.object({
      label: z.enum(["A", "B", "C", "D"]),
      text: z.string().min(1, "Option text is required"),
    }),
  )
  .length(4, "MCQ must have exactly 4 options");

const examInfoSchema = z.object({
  category: z.enum(["BCS", "Bank", "Primary", "NTRCA", "Other"]),
  examName: z.string().optional(),

  year: z.number().optional(),
});

const createQuestionValidationSchema = z.object({
  body: z.object({
    subjectId: z.string(),
    chapterId: z.string(),
    topicId: z.string(),
    questionText: z.string().min(5, "Question must be at least 5 characters"),
    options: optionsSchema,
    correctAnswer: z.enum(["A", "B", "C", "D"]),
    explanation: z.string().optional(),
    examInfo: examInfoSchema.optional(),
    tags: z.array(z.string()).optional(),
    status: z.nativeEnum(QuestionStatus).optional(),
  }),
});

const updateQuestionValidationSchema = z.object({
  body: z.object({
    questionText: z.string().min(5).optional(),
    options: optionsSchema.optional(),
    correctAnswer: z.enum(["A", "B", "C", "D"]).optional(),
    explanation: z.string().optional(),
    examInfo: examInfoSchema.optional(),
    tags: z.array(z.string()).optional(),
    status: z.nativeEnum(QuestionStatus).optional(),
  }),
});

export const QuestionValidation = {
  createQuestionValidationSchema,
  updateQuestionValidationSchema,
};
