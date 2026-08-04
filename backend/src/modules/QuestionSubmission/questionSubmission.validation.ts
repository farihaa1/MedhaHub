import { z } from "zod";
import { SubmissionType } from "./questionSubmission.constant";

const optionSchema = z.object({
  label: z.enum(["A", "B", "C", "D"]),
  text: z.string({
    error: "Option text is required",
  }),
});

const createQuestionSubmissionValidationSchema = z.object({
  body: z
    .object({
      submissionType: z.nativeEnum(SubmissionType),

      existingQuestionId: z.string().optional(),

      subjectId: z.string({
        error: "Subject is required",
      }),

      chapterId: z.string().optional(),

      suggestedChapterTitle: z.string().trim().optional(),

      topicId: z.string().optional(),

      suggestedTopicTitle: z.string().trim().optional(),

      questionText: z.string({
        error: "Question is required",
      }),

      options: z
        .array(optionSchema)
        .length(4, "Question must contain exactly 4 options"),

      correctAnswer: z.enum(["A", "B", "C", "D"]),

      explanation: z.string().optional(),

      tags: z.array(z.string()).optional(),
    })
    .superRefine((data, ctx) => {
      if (!data.chapterId && !data.suggestedChapterTitle) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Either chapterId or suggestedChapterTitle is required",
          path: ["chapterId"],
        });
      }

      if (!data.topicId && !data.suggestedTopicTitle) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Either topicId or suggestedTopicTitle is required",
          path: ["topicId"],
        });
      }

      if (
        data.submissionType === SubmissionType.UPDATE &&
        !data.existingQuestionId
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "existingQuestionId is required for UPDATE submission",
          path: ["existingQuestionId"],
        });
      }
    }),
});

const rejectSubmissionValidationSchema = z.object({
  body: z.object({
    reviewComment: z
      .string({
        error: "Review comment is required",
      })
      .min(5, "Review comment must be at least 5 characters"),
  }),
});

export const QuestionSubmissionValidation = {
  createQuestionSubmissionValidationSchema,
  rejectSubmissionValidationSchema,
};
