"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuestionBanksValidation = exports.restoreQuestionBankValidationSchema = exports.archiveQuestionBankValidationSchema = exports.rejectQuestionBankValidationSchema = exports.publishQuestionBankValidationSchema = exports.updateQuestionBanksValidationSchema = exports.bulkCreateQuestionBanksValidationSchema = exports.createQuestionBanksValidationSchema = void 0;
const zod_1 = require("zod");
const questionBanks_constant_1 = require("./questionBanks.constant");
/* ============================================================
 * Enums
 * ========================================================== */
const CategoryEnum = zod_1.z.enum([...questionBanks_constant_1.QUESTION_BANKS_CATEGORY]);
const PaperEnum = zod_1.z.enum([...questionBanks_constant_1.QUESTION_BANKS_PAPER]);
const StatusEnum = zod_1.z.enum([...questionBanks_constant_1.QUESTION_BANKS_STATUS]);
const VisibilityEnum = zod_1.z.nativeEnum(questionBanks_constant_1.QuestionBanksVisibility);
/* ============================================================
 * Base Schema
 * ========================================================== */
const QuestionBankSchema = zod_1.z.object({
    title: zod_1.z.string().trim().min(3).max(200),
    description: zod_1.z.string().trim().max(3000).optional(),
    category: CategoryEnum,
    organization: zod_1.z.string().trim().max(200).optional(),
    year: zod_1.z.number().int().min(1900).max(2100).optional(),
    paper: PaperEnum.optional(),
    visibility: VisibilityEnum.optional(),
    isPremium: zod_1.z.boolean().optional(),
    slug: zod_1.z
        .string()
        .trim()
        .min(3)
        .max(200)
        .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must contain only lowercase letters, numbers and hyphens")
        .optional(),
    status: StatusEnum.optional(),
    reviewRemark: zod_1.z.string().trim().max(1000).optional(),
});
/* ============================================================
 * Create
 * ========================================================== */
exports.createQuestionBanksValidationSchema = zod_1.z.object({
    body: QuestionBankSchema,
});
/* ============================================================
 * Bulk Create
 * ========================================================== */
exports.bulkCreateQuestionBanksValidationSchema = zod_1.z.object({
    body: zod_1.z.array(QuestionBankSchema).min(1),
});
/* ============================================================
 * Update
 * ========================================================== */
exports.updateQuestionBanksValidationSchema = zod_1.z.object({
    body: QuestionBankSchema.partial(),
});
/* ============================================================
 * Publish
 * ========================================================== */
exports.publishQuestionBankValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        slug: zod_1.z
            .string()
            .trim()
            .min(3)
            .max(200)
            .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Invalid slug format"),
        status: zod_1.z.literal(questionBanks_constant_1.QuestionBanksStatus.PUBLISHED),
    }),
});
/* ============================================================
 * Reject
 * ========================================================== */
exports.rejectQuestionBankValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        reviewRemark: zod_1.z.string().trim().min(3).max(1000),
        status: zod_1.z.literal(questionBanks_constant_1.QuestionBanksStatus.REJECTED),
    }),
});
/* ============================================================
 * Archive
 * ========================================================== */
exports.archiveQuestionBankValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        status: zod_1.z.literal(questionBanks_constant_1.QuestionBanksStatus.ARCHIVED),
    }),
});
/* ============================================================
 * Restore
 * ========================================================== */
exports.restoreQuestionBankValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        status: zod_1.z.literal(questionBanks_constant_1.QuestionBanksStatus.PUBLISHED),
    }),
});
/* ============================================================
 * Export
 * ========================================================== */
exports.QuestionBanksValidation = {
    createQuestionBanksValidationSchema: exports.createQuestionBanksValidationSchema,
    bulkCreateQuestionBanksValidationSchema: exports.bulkCreateQuestionBanksValidationSchema,
    updateQuestionBanksValidationSchema: exports.updateQuestionBanksValidationSchema,
    publishQuestionBankValidationSchema: exports.publishQuestionBankValidationSchema,
    rejectQuestionBankValidationSchema: exports.rejectQuestionBankValidationSchema,
    archiveQuestionBankValidationSchema: exports.archiveQuestionBankValidationSchema,
    restoreQuestionBankValidationSchema: exports.restoreQuestionBankValidationSchema,
};
//# sourceMappingURL=questionBanks.validation.js.map