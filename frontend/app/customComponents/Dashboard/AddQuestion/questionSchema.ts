import { z } from "zod"

export const questionSchema = z.object({
  questionText: z.string().min(5),

  options: z
    .array(
      z.object({
        label: z.enum(["A", "B", "C", "D"]),
        text: z.string().min(1),
      })
    )
    .length(4),

  correctAnswer: z.enum(["A", "B", "C", "D"]),

  tags: z.array(z.string()).optional(),
})
export type QuestionFormValues = z.input<typeof questionSchema>
