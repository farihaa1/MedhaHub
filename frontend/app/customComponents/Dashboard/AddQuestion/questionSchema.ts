import { z } from "zod"

export const questionSchema = z.object({
  subjectId: z.string().min(1, "Subject is required"),

  chapterId: z.string().min(1, "Chapter is required"),

  topicId: z.string().min(1, "Topic is required"),

  questionText: z.string().min(5, "Question must be at least 5 characters"),

  options: z.array(
    z.object({
      label: z.enum(["A", "B", "C", "D"]),
      text: z.string().min(1, "Option text is required"),
    })
  ),

  correctAnswer: z.enum(["A", "B", "C", "D"]),
})

export type QuestionFormValues = z.infer<typeof questionSchema>
