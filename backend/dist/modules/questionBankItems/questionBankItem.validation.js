"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuestionBankItemValidation = void 0;
const zod_1 = require("zod");
/* ======================================================
   Add Single Question
====================================================== */
const addQuestionValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        question: zod_1.z.string().min(1, "Question id is required"),
        order: zod_1.z.number().int().min(1).optional(),
        marks: zod_1.z.number().min(0).optional(),
        negativeMarks: zod_1.z.number().min(0).optional(),
    }),
});
/* ======================================================
   Bulk Add Questions
====================================================== */
const bulkAddQuestionsValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        questionIds: zod_1.z
            .array(zod_1.z.string().min(1))
            .min(1, "At least one question is required"),
    }),
});
/* ======================================================
   Reorder Questions
====================================================== */
const reorderQuestionsValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        items: zod_1.z
            .array(zod_1.z.object({
            id: zod_1.z.string().min(1),
            order: zod_1.z.number().int().min(1),
        }))
            .min(1),
    }),
});
/* ======================================================
   Update Question Bank Item
====================================================== */
const updateQuestionBankItemValidationSchema = zod_1.z.object({
    body: zod_1.z
        .object({
        order: zod_1.z.number().int().min(1).optional(),
        marks: zod_1.z.number().min(0).optional(),
        negativeMarks: zod_1.z.number().min(0).optional(),
        isActive: zod_1.z.boolean().optional(),
    })
        .strict(),
});
/* ======================================================
   Export
====================================================== */
exports.QuestionBankItemValidation = {
    addQuestionValidationSchema,
    bulkAddQuestionsValidationSchema,
    reorderQuestionsValidationSchema,
    updateQuestionBankItemValidationSchema,
};
//# sourceMappingURL=questionBankItem.validation.js.map