"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePracticeSetValidationSchema = exports.createPracticeSetValidationSchema = void 0;
const zod_1 = require("zod");
const practiceSet_constant_1 = require("./practiceSet.constant");
const objectId = zod_1.z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId");
const settingsSchema = zod_1.z.object({
    duration: zod_1.z.number().int().positive().optional(),
    negativeMark: zod_1.z.number().min(0).optional(),
    shuffleQuestions: zod_1.z.boolean().optional(),
    shuffleOptions: zod_1.z.boolean().optional(),
});
exports.createPracticeSetValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string().trim().min(3).max(200),
        description: zod_1.z.string().trim().optional(),
        subject: objectId,
        chapter: objectId.optional(),
        topics: zod_1.z.array(objectId).optional(),
        questions: zod_1.z
            .array(objectId)
            .min(1, "Practice set must contain at least one question."),
        settings: settingsSchema.optional(),
        visibility: zod_1.z
            .enum(Object.values(practiceSet_constant_1.PracticeSetVisibility))
            .default(practiceSet_constant_1.PracticeSetVisibility.PUBLIC),
        isPremium: zod_1.z.boolean().default(false),
        status: zod_1.z
            .enum(Object.values(practiceSet_constant_1.PracticeSetStatus))
            .default(practiceSet_constant_1.PracticeSetStatus.DRAFT),
        tags: zod_1.z.array(zod_1.z.string().trim()).optional(),
    }),
});
exports.updatePracticeSetValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string().trim().min(3).max(200).optional(),
        description: zod_1.z.string().trim().optional(),
        subject: objectId.optional(),
        chapter: objectId.optional(),
        topics: zod_1.z.array(objectId).optional(),
        questions: zod_1.z.array(objectId).min(1).optional(),
        settings: settingsSchema.partial().optional(),
        visibility: zod_1.z
            .enum(Object.values(practiceSet_constant_1.PracticeSetVisibility))
            .optional(),
        isPremium: zod_1.z.boolean().optional(),
        status: zod_1.z
            .enum(Object.values(practiceSet_constant_1.PracticeSetStatus))
            .optional(),
        tags: zod_1.z.array(zod_1.z.string().trim()).optional(),
    }),
});
//# sourceMappingURL=practiceSet.validation.js.map