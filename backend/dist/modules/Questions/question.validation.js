"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuestionValidation = void 0;
const zod_1 = require("zod");
const question_constant_1 = require("./question.constant");
/* ==========================================================
   ENUMS
========================================================== */
const QuestionTypeEnum = zod_1.z.nativeEnum(question_constant_1.QuestionType);
const QuestionDifficultyEnum = zod_1.z.nativeEnum(question_constant_1.QuestionDifficulty);
const QuestionStatusEnum = zod_1.z.nativeEnum(question_constant_1.QuestionStatus);
const QuestionSourceTypeEnum = zod_1.z.nativeEnum(question_constant_1.QuestionSourceType);
/* ==========================================================
   OPTION
========================================================== */
const optionSchema = zod_1.z.object({
    text: zod_1.z.string().min(1, "Option text is required"),
    image: zod_1.z.string().nullable().optional(),
    isCorrect: zod_1.z.boolean(),
});
/* ==========================================================
   SOURCE
========================================================== */
const sourceSchema = zod_1.z.object({
    type: QuestionSourceTypeEnum,
    name: zod_1.z.string().min(1, "Source name is required"),
    year: zod_1.z.number().optional(),
});
/* ==========================================================
   CREATE
========================================================== */
const createQuestionValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        subjectId: zod_1.z.string().min(1),
        chapterId: zod_1.z.string().min(1),
        topicId: zod_1.z.string().min(1),
        type: QuestionTypeEnum.optional(),
        questionText: zod_1.z.string().min(5, "Question must be at least 5 characters"),
        questionImage: zod_1.z.string().nullable().optional(),
        options: zod_1.z
            .array(optionSchema)
            .length(4, "MCQ must contain exactly four options")
            .refine((options) => options.filter((o) => o.isCorrect).length === 1, {
            message: "Exactly one option must be correct",
        }),
        explanation: zod_1.z.string().optional(),
        explanationImage: zod_1.z.string().nullable().optional(),
        difficulty: QuestionDifficultyEnum,
        marks: zod_1.z.number().min(1).optional(),
        negativeMarks: zod_1.z.number().min(0).optional(),
        tags: zod_1.z.array(zod_1.z.string()).optional(),
        sources: zod_1.z.array(sourceSchema).optional(),
        status: QuestionStatusEnum.optional(),
        createdBy: zod_1.z.string().optional(),
        approvedBy: zod_1.z.string().optional(),
        approvedAt: zod_1.z.coerce.date().optional(),
    }),
});
/* ==========================================================
   UPDATE
========================================================== */
const updateQuestionValidationSchema = zod_1.z.object({
    body: zod_1.z
        .object({
        subjectId: zod_1.z.string().min(1).optional(),
        chapterId: zod_1.z.string().min(1).optional(),
        topicId: zod_1.z.string().min(1).optional(),
        type: QuestionTypeEnum.optional(),
        questionText: zod_1.z.string().min(5).optional(),
        questionImage: zod_1.z.string().nullable().optional(),
        options: zod_1.z
            .array(optionSchema)
            .length(4)
            .refine((options) => options.filter((o) => o.isCorrect).length === 1, {
            message: "Exactly one option must be correct",
        })
            .optional(),
        explanation: zod_1.z.string().optional(),
        explanationImage: zod_1.z.string().nullable().optional(),
        difficulty: QuestionDifficultyEnum.optional(),
        marks: zod_1.z.number().min(1).optional(),
        negativeMarks: zod_1.z.number().min(0).optional(),
        tags: zod_1.z.array(zod_1.z.string()).optional(),
        sources: zod_1.z.array(sourceSchema).optional(),
        status: QuestionStatusEnum.optional(),
        approvedBy: zod_1.z.string().optional(),
        approvedAt: zod_1.z.coerce.date().optional(),
    })
        .partial(),
});
/* ==========================================================
   BULK CREATE
========================================================== */
const bulkCreateQuestionValidationSchema = zod_1.z.object({
    body: zod_1.z.array(createQuestionValidationSchema.shape.body).min(1),
});
/* ==========================================================
   EXPORT
========================================================== */
exports.QuestionValidation = {
    createQuestionValidationSchema,
    updateQuestionValidationSchema,
    bulkCreateQuestionValidationSchema,
};
//# sourceMappingURL=question.validation.js.map