import { z } from "zod"

export const questionSchema = z.object({
  subjectId: z.string().min(1, "Subject is required"),

  chapterId: z.string().min(1, "Chapter is required"),

  topicId: z.string().min(1, "Topic is required"),

  question: z.string().min(1, "Question is required"),

  options: z
    .array(
      z.object({
        text: z.string().min(1, "Option is required"),
      })
    )
    .length(4),

  correctAnswer: z.number(),

  explanation: z.string().optional(),

  difficulty: z.enum(["easy", "medium", "hard"]),

  type: z.enum(["mcq", "written", "true_false"]),

  source: z.string(),

  marks: z.number(),

  negativeMarks: z.number(),

  tags: z.array(z.string()).optional(),
})

export type QuestionFormValues = z.infer<typeof questionSchema>
