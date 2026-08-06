"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuestionBankValidation = void 0;
const zod_1 = require("zod");
const questionBank_constant_1 = require("./questionBank.constant");
/* ============================================================
   Enums
============================================================ */
const CategoryEnum = zod_1.z.enum([...questionBank_constant_1.QUESTION_BANK_CATEGORY]);
const PaperEnum = zod_1.z.enum([...questionBank_constant_1.QUESTION_BANK_PAPER]);
const VisibilityEnum = zod_1.z.enum([...questionBank_constant_1.QUESTION_BANK_VISIBILITY]);
/* ============================================================
   Create
============================================================ */
const createQuestionBankValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z
            .string()
            .trim()
            .min(3, "Title must be at least 3 characters")
            .max(200),
        slug: zod_1.z.string().trim().min(3).max(200).optional(),
        category: CategoryEnum,
        year: zod_1.z.number().int().min(1900).max(2100).optional(),
        paper: PaperEnum.optional(),
        organization: zod_1.z.string().trim().max(200).optional(),
        description: zod_1.z.string().trim().max(2000).optional(),
        visibility: VisibilityEnum.optional(),
        isPublished: zod_1.z.boolean().optional(),
        isPremium: zod_1.z.boolean().optional(),
    }),
});
/* ============================================================
   Update
============================================================ */
const updateQuestionBankValidationSchema = zod_1.z.object({
    body: zod_1.z
        .object({
        title: zod_1.z.string().trim().min(3).max(200).optional(),
        slug: zod_1.z.string().trim().min(3).max(200).optional(),
        category: CategoryEnum.optional(),
        year: zod_1.z.number().int().min(1900).max(2100).optional(),
        paper: PaperEnum.optional(),
        organization: zod_1.z.string().trim().max(200).optional(),
        description: zod_1.z.string().trim().max(2000).optional(),
        visibility: VisibilityEnum.optional(),
        isPublished: zod_1.z.boolean().optional(),
        isPremium: zod_1.z.boolean().optional(),
    })
        .strict(),
});
exports.QuestionBankValidation = {
    createQuestionBankValidationSchema,
    updateQuestionBankValidationSchema,
};
//# sourceMappingURL=questionBank.validation.js.map