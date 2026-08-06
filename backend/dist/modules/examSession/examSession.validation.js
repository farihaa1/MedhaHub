"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.submitAnswerValidationSchema = exports.submitSessionValidationSchema = exports.getSessionValidationSchema = void 0;
const zod_1 = require("zod");
const objectId = zod_1.z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId");
exports.getSessionValidationSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: objectId,
    }),
});
exports.submitSessionValidationSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: objectId,
    }),
});
exports.submitAnswerValidationSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: objectId,
    }),
    body: zod_1.z.object({
        questionId: objectId,
        selectedOption: zod_1.z.enum(["A", "B", "C", "D"]),
        timeTaken: zod_1.z.number().min(0).optional(),
    }),
});
//# sourceMappingURL=examSession.validation.js.map