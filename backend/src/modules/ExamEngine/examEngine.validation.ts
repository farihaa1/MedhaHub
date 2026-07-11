import { z } from "zod";
import { ExamType } from "./examEngine.constant";

const objectId = z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId");

export const startExamValidationSchema = z.object({
  body: z
    .object({
      examType: z.enum(Object.values(ExamType) as [string, ...string[]]),

      subjectId: objectId.optional(),

      chapterId: objectId.optional(),

      topicIds: z.array(objectId).optional(),

      sourceId: objectId.optional(),

      source: z.string().optional(),

      year: z.number().optional(),

      questionCount: z.number().int().positive().optional(),
    })
    .superRefine((data, ctx) => {
      switch (data.examType) {
        case ExamType.TOPIC:
          if (!data.topicIds?.length) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              path: ["topicIds"],
              message: "Topic ids are required.",
            });
          }
          break;

        case ExamType.CHAPTER:
          if (!data.chapterId) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              path: ["chapterId"],
              message: "Chapter id is required.",
            });
          }
          break;

        case ExamType.SUBJECT:
          if (!data.subjectId) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              path: ["subjectId"],
              message: "Subject id is required.",
            });
          }
          break;

        case ExamType.PRACTICE_SET:
        case ExamType.MODEL_TEST:
          if (!data.sourceId) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              path: ["sourceId"],
              message: "Source id is required.",
            });
          }
          break;

        default:
          break;
      }
    }),
});
