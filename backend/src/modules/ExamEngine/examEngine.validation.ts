import { z } from "zod";
import { ExamType } from "./examEngine.constant";

const objectId = z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId");

export const startExamValidationSchema = z.object({
  body: z.object({
    examType: z.enum(Object.values(ExamType) as [string, ...string[]]),

    sourceId: objectId.optional(),

    subjectId: objectId.optional(),

    chapterId: objectId.optional(),

    topicIds: z.array(objectId).optional(),

    questionCount: z.number().int().positive().optional(),
  }),
});

