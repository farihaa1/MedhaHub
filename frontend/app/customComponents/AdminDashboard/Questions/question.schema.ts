import { z } from "zod"

import {
  QuestionDifficulty,
  QuestionSourceType,
} from "@/app/redux/api/questionsApi"

/* ==========================================================
   Source Schema
========================================================== */

const sourceSchema = z.object({
  type: z.nativeEnum(QuestionSourceType),

  name: z.string().min(1, "Source name is required"),

  year: z.number().optional(),
})

/* ==========================================================
   Question Schema
========================================================== */

export const questionSchema = z.object({
  subjectId: z.string().min(1, "Subject is required"),

  chapterId: z.string().min(1, "Chapter is required"),

  topicId: z.string().min(1, "Topic is required"),

  questionText: z.string().min(1, "Question is required"),

  questionImage: z.string().nullable().optional(),

  options: z
    .array(
      z.object({
        text: z.string().min(1, "Option is required"),

        image: z.string().nullable().optional(),

        isCorrect: z.boolean(),
      })
    )
    .length(4, "Exactly four options are required")
    .refine((options) => options.filter((o) => o.isCorrect).length === 1, {
      message: "Exactly one option must be correct",
    }),

  explanation: z.string().optional(),

  explanationImage: z.string().nullable().optional(),

  difficulty: z.nativeEnum(QuestionDifficulty),

  tags: z.array(z.string()),

  sources: z.array(sourceSchema),
})

export type QuestionFormValues = z.infer<typeof questionSchema>

export const defaultQuestionValues: QuestionFormValues = {
  subjectId: "",

  chapterId: "",

  topicId: "",

  questionText: "",

  questionImage: null,

  options: [
    {
      text: "",
      image: null,
      isCorrect: true,
    },
    {
      text: "",
      image: null,
      isCorrect: false,
    },
    {
      text: "",
      image: null,
      isCorrect: false,
    },
    {
      text: "",
      image: null,
      isCorrect: false,
    },
  ],

  explanation: "",

  explanationImage: null,

  difficulty: QuestionDifficulty.MEDIUM,

  tags: [],

  sources: [
    {
      type: QuestionSourceType.CUSTOM,
      name: "Custom",
    },
  ],
}
