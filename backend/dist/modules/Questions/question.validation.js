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
    year: zod_1.z.number().int().optional(),
});
/* ==========================================================
   CREATE QUESTION
========================================================== */
const createQuestionValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        /* -----------------------------------------
           Academic classification
        ----------------------------------------- */
        subjectId: zod_1.z.string().min(1, "Subject is required"),
        chapterId: zod_1.z.string().min(1, "Chapter is required"),
        topicId: zod_1.z.string().min(1, "Topic is required"),
        /* -----------------------------------------
           Question
        ----------------------------------------- */
        type: QuestionTypeEnum.optional(),
        questionText: zod_1.z
            .string()
            .min(5, "Question must be at least 5 characters")
            .trim(),
        questionImage: zod_1.z.string().nullable().optional(),
        /* -----------------------------------------
           Options
        ----------------------------------------- */
        options: zod_1.z
            .array(optionSchema)
            .length(4, "MCQ must contain exactly four options")
            .refine((options) => options.filter((option) => option.isCorrect).length === 1, {
            message: "Exactly one option must be correct",
        }),
        /* -----------------------------------------
           Explanation
        ----------------------------------------- */
        explanation: zod_1.z.string().optional(),
        explanationImage: zod_1.z.string().nullable().optional(),
        /* -----------------------------------------
           Metadata
        ----------------------------------------- */
        difficulty: QuestionDifficultyEnum,
        tags: zod_1.z.array(zod_1.z.string()).optional(),
        sources: zod_1.z.array(sourceSchema).optional(),
        /* -----------------------------------------
           Workflow fields
    
           These are accepted by validation,
           but controller/service decides status.
        ----------------------------------------- */
        status: QuestionStatusEnum.optional(),
        createdBy: zod_1.z.string().optional(),
        approvedBy: zod_1.z.string().optional(),
        approvedAt: zod_1.z.coerce.date().optional(),
    }),
});
/* ==========================================================
   UPDATE QUESTION
========================================================== */
const updateQuestionValidationSchema = zod_1.z.object({
    body: zod_1.z
        .object({
        /* -----------------------------------------
           Academic classification
        ----------------------------------------- */
        subjectId: zod_1.z.string().min(1).optional(),
        chapterId: zod_1.z.string().min(1).optional(),
        topicId: zod_1.z.string().min(1).optional(),
        /* -----------------------------------------
           Question
        ----------------------------------------- */
        type: QuestionTypeEnum.optional(),
        questionText: zod_1.z.string().min(5).trim().optional(),
        questionImage: zod_1.z.string().nullable().optional(),
        /* -----------------------------------------
           Options
        ----------------------------------------- */
        options: zod_1.z
            .array(optionSchema)
            .length(4, "MCQ must contain exactly four options")
            .refine((options) => options.filter((option) => option.isCorrect).length === 1, {
            message: "Exactly one option must be correct",
        })
            .optional(),
        /* -----------------------------------------
           Explanation
        ----------------------------------------- */
        explanation: zod_1.z.string().optional(),
        explanationImage: zod_1.z.string().nullable().optional(),
        /* -----------------------------------------
           Metadata
        ----------------------------------------- */
        difficulty: QuestionDifficultyEnum.optional(),
        tags: zod_1.z.array(zod_1.z.string()).optional(),
        sources: zod_1.z.array(sourceSchema).optional(),
        /* -----------------------------------------
           Workflow
        ----------------------------------------- */
        status: QuestionStatusEnum.optional(),
        approvedBy: zod_1.z.string().optional(),
        approvedAt: zod_1.z.coerce.date().optional(),
    })
        .partial(),
});
/* ==========================================================
   BULK CREATE QUESTIONS
========================================================== */
const bulkCreateQuestionValidationSchema = zod_1.z.object({
    body: zod_1.z
        .array(createQuestionValidationSchema.shape.body)
        .min(1, "At least one question is required"),
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