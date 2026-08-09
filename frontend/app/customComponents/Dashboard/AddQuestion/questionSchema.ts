import { z } from "zod"

import {
  QuestionDifficulty,
  QuestionSourceType,
} from "@/app/redux/api/questionsApi"

/* =========================================================
   OPTION SCHEMA
========================================================= */

const optionSchema = z.object({
  label: z.enum(["A", "B", "C", "D"]),

  text: z.string().trim().min(1, "অপশনের লেখা দিতে হবে।"),

  image: z.string().optional(),
})

/* =========================================================
   SOURCE SCHEMA
========================================================= */

const sourceSchema = z.object({
  type: z.nativeEnum(QuestionSourceType),

  name: z.string().trim().min(1, "উৎসের নাম দিতে হবে।"),

  year: z.number().optional(),
})

/* =========================================================
   QUESTION SCHEMA
========================================================= */

export const questionSchema = z.object({
  questionText: z.string().trim().min(5, "প্রশ্ন কমপক্ষে ৫ অক্ষরের হতে হবে।"),

  questionImage: z.string().optional(),

  options: z.array(optionSchema).length(4, "ঠিক ৪টি অপশন থাকতে হবে।"),

  correctAnswer: z.enum(["A", "B", "C", "D"]),

  explanation: z.string().optional(),

  explanationImage: z.string().optional(),

  difficulty: z.nativeEnum(QuestionDifficulty),

  tags: z.array(z.string()).default([]),

  sources: z.array(sourceSchema).default([]),
})

/* =========================================================
   FORM TYPE
========================================================= */

export type QuestionFormValues = z.infer<typeof questionSchema>
