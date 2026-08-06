"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateModelTestValidationSchema = exports.createModelTestValidationSchema = void 0;
const zod_1 = require("zod");
const modelTest_constant_1 = require("./modelTest.constant");
const objectId = zod_1.z.string().regex(/^[0-9a-fA-F]{24}$/);
const settingsSchema = zod_1.z.object({
    duration: zod_1.z.number().int().positive(),
    negativeMark: zod_1.z.number().min(0).optional(),
    shuffleQuestions: zod_1.z.boolean().optional(),
    shuffleOptions: zod_1.z.boolean().optional(),
});
const scheduleSchema = zod_1.z.object({
    startDate: zod_1.z.coerce.date().optional(),
    endDate: zod_1.z.coerce.date().optional(),
});
exports.createModelTestValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string().trim().min(3).max(200),
        description: zod_1.z.string().trim().optional(),
        questions: zod_1.z.array(objectId).min(1, "At least one question is required."),
        settings: settingsSchema,
        schedule: scheduleSchema.optional(),
        visibility: zod_1.z
            .enum(Object.values(modelTest_constant_1.ModelTestVisibility))
            .default(modelTest_constant_1.ModelTestVisibility.PUBLIC),
        isPremium: zod_1.z.boolean().default(false),
        status: zod_1.z
            .enum(Object.values(modelTest_constant_1.ModelTestStatus))
            .default(modelTest_constant_1.ModelTestStatus.DRAFT),
        tags: zod_1.z.array(zod_1.z.string()).optional(),
    }),
});
exports.updateModelTestValidationSchema = zod_1.z.object({
    body: zod_1.z
        .object({
        title: zod_1.z.string().trim().min(3).max(200),
        description: zod_1.z.string().trim(),
        questions: zod_1.z.array(objectId).min(1),
        settings: settingsSchema.partial(),
        schedule: scheduleSchema,
        visibility: zod_1.z.enum(Object.values(modelTest_constant_1.ModelTestVisibility)),
        isPremium: zod_1.z.boolean(),
        status: zod_1.z.enum(Object.values(modelTest_constant_1.ModelTestStatus)),
        tags: zod_1.z.array(zod_1.z.string()),
    })
        .partial(),
});
//# sourceMappingURL=modelTest.validation.js.map