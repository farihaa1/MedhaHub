"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuestionSubmissionValidation = void 0;
const zod_1 = require("zod");
const questionSubmission_constant_1 = require("./questionSubmission.constant");
const optionSchema = zod_1.z.object({
    label: zod_1.z.enum(["A", "B", "C", "D"]),
    text: zod_1.z.string({
        error: "Option text is required",
    }),
});
const createQuestionSubmissionValidationSchema = zod_1.z.object({
    body: zod_1.z
        .object({
        submissionType: zod_1.z.nativeEnum(questionSubmission_constant_1.SubmissionType),
        existingQuestionId: zod_1.z.string().optional(),
        subjectId: zod_1.z.string({
            error: "Subject is required",
        }),
        chapterId: zod_1.z.string().optional(),
        suggestedChapterTitle: zod_1.z.string().trim().optional(),
        topicId: zod_1.z.string().optional(),
        suggestedTopicTitle: zod_1.z.string().trim().optional(),
        questionText: zod_1.z.string({
            error: "Question is required",
        }),
        options: zod_1.z
            .array(optionSchema)
            .length(4, "Question must contain exactly 4 options"),
        correctAnswer: zod_1.z.enum(["A", "B", "C", "D"]),
        explanation: zod_1.z.string().optional(),
        tags: zod_1.z.array(zod_1.z.string()).optional(),
    })
        .superRefine((data, ctx) => {
        if (!data.chapterId && !data.suggestedChapterTitle) {
            ctx.addIssue({
                code: zod_1.z.ZodIssueCode.custom,
                message: "Either chapterId or suggestedChapterTitle is required",
                path: ["chapterId"],
            });
        }
        if (!data.topicId && !data.suggestedTopicTitle) {
            ctx.addIssue({
                code: zod_1.z.ZodIssueCode.custom,
                message: "Either topicId or suggestedTopicTitle is required",
                path: ["topicId"],
            });
        }
        if (data.submissionType === questionSubmission_constant_1.SubmissionType.UPDATE &&
            !data.existingQuestionId) {
            ctx.addIssue({
                code: zod_1.z.ZodIssueCode.custom,
                message: "existingQuestionId is required for UPDATE submission",
                path: ["existingQuestionId"],
            });
        }
    }),
});
const rejectSubmissionValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        reviewComment: zod_1.z
            .string({
            error: "Review comment is required",
        })
            .min(5, "Review comment must be at least 5 characters"),
    }),
});
exports.QuestionSubmissionValidation = {
    createQuestionSubmissionValidationSchema,
    rejectSubmissionValidationSchema,
};
//# sourceMappingURL=questionSubmission.validation.js.map