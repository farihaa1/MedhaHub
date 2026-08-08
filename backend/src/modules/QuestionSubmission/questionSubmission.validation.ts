import { z } from "zod";

import { SubmissionType } from "./questionSubmission.constant";

const optionSchema = z.object({
  label: z.enum(["A", "B", "C", "D"]),

  text: z
    .string({
      error: "Option text is required",
    })
    .trim()
    .min(1, "Option text is required"),

  image: z.string().optional(),
});

const createQuestionSubmissionValidationSchema = z.object({
  body: z
    .object({
      submissionType: z.nativeEnum(SubmissionType),

      existingQuestionId: z.string().optional(),

      subjectId: z
        .string({
          error: "Subject is required",
        })
        .min(1),

      chapterId: z.string().optional(),

      suggestedChapterTitle: z.string().trim().optional(),

      topicId: z.string().optional(),

      suggestedTopicTitle: z.string().trim().optional(),

      questionText: z
        .string({
          error: "Question is required",
        })
        .trim()
        .min(1),

      options: z
        .array(optionSchema)
        .length(4, "Question must contain exactly 4 options"),

      correctAnswer: z.enum(["A", "B", "C", "D"]),

      explanation: z.string().optional(),

      tags: z.array(z.string()).optional(),
    })
    .superRefine((data, ctx) => {
      /**
       * --------------------------------------------------------
       * Chapter
       * --------------------------------------------------------
       */

      if (!data.chapterId && !data.suggestedChapterTitle) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Either chapterId or suggestedChapterTitle is required",
          path: ["chapterId"],
        });
      }

      if (data.chapterId && data.suggestedChapterTitle) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message:
            "Provide either chapterId or suggestedChapterTitle, not both",
          path: ["chapterId"],
        });
      }

      /**
       * --------------------------------------------------------
       * Topic
       * --------------------------------------------------------
       */

      if (!data.topicId && !data.suggestedTopicTitle) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Either topicId or suggestedTopicTitle is required",
          path: ["topicId"],
        });
      }

      if (data.topicId && data.suggestedTopicTitle) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Provide either topicId or suggestedTopicTitle, not both",
          path: ["topicId"],
        });
      }

      /**
       * --------------------------------------------------------
       * Submission type
       * --------------------------------------------------------
       */

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

      if (
        data.submissionType === SubmissionType.NEW &&
        data.existingQuestionId
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "existingQuestionId is not allowed for NEW submission",
          path: ["existingQuestionId"],
        });
      }

      /**
       * --------------------------------------------------------
       * Option labels
       * --------------------------------------------------------
       */

      const labels = data.options.map((option) => option.label);

      const uniqueLabels = new Set(labels);

      if (
        uniqueLabels.size !== 4 ||
        !["A", "B", "C", "D"].every((label) =>
          uniqueLabels.has(label as "A" | "B" | "C" | "D"),
        )
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Options must contain exactly A, B, C and D",
          path: ["options"],
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
      .trim()
      .min(5, "Review comment must be at least 5 characters"),
  }),
});

export const QuestionSubmissionValidation = {
  createQuestionSubmissionValidationSchema,

  rejectSubmissionValidationSchema,
};
