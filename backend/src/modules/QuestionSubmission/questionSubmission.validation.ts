import { z } from "zod";

// Option validation

const optionSchema = z.object({
  label: z.enum(["A", "B", "C", "D"]),

  text: z.string().min(1, "Option text is required").trim(),
});

// Create Submission Validation

const createQuestionSubmissionValidationSchema = z.object({
  body: z
    .object({
      subjectId: z.string({
        error: "Subject is required",
      }),

      chapterId: z.string().optional(),

      suggestedChapterTitle: z.string().trim().optional(),

      topicId: z.string().optional(),

      suggestedTopicTitle: z.string().trim().optional(),

      questionText: z
        .string({
          error: "Question text is required",
        })
        .min(5, "Question must be at least 5 characters")
        .trim(),

      options: z
        .array(optionSchema)
        .length(4, "Exactly 4 options are required"),

      correctAnswer: z.enum(["A", "B", "C", "D"]),

      explanation: z.string().optional(),

      tags: z.array(z.string()).optional(),
    })

    // chapter/topic custom validation

    .refine(
      (data) => {
        return !!data.chapterId || !!data.suggestedChapterTitle;
      },
      {
        message: "Either chapterId or suggestedChapterTitle is required",
        path: ["chapterId"],
      },
    )

    .refine(
      (data) => {
        return !!data.topicId || !!data.suggestedTopicTitle;
      },
      {
        message: "Either topicId or suggestedTopicTitle is required",
        path: ["topicId"],
      },
    ),
});

// Reject Validation

const rejectSubmissionValidationSchema = z.object({
  body: z.object({
    reviewComment: z
      .string({
        error: "Reject reason is required",
      })
      .min(5, "Reject reason must be meaningful")
      .trim(),
  }),
});

export const QuestionSubmissionValidation = {
  createQuestionSubmissionValidationSchema,

  rejectSubmissionValidationSchema,
};
