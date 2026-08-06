"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.startExamValidationSchema = void 0;
const zod_1 = require("zod");
const examEngine_constant_1 = require("./examEngine.constant");
const objectId = zod_1.z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId");
exports.startExamValidationSchema = zod_1.z.object({
    body: zod_1.z
        .object({
        examType: zod_1.z.enum(Object.values(examEngine_constant_1.ExamType)),
        subjectId: objectId.optional(),
        chapterId: objectId.optional(),
        topicIds: zod_1.z.array(objectId).optional(),
        sourceId: objectId.optional(),
        source: zod_1.z.string().optional(),
        year: zod_1.z.number().optional(),
        questionCount: zod_1.z.number().int().positive().optional(),
    })
        .superRefine((data, ctx) => {
        switch (data.examType) {
            case examEngine_constant_1.ExamType.TOPIC:
                if (!data.topicIds?.length) {
                    ctx.addIssue({
                        code: zod_1.z.ZodIssueCode.custom,
                        path: ["topicIds"],
                        message: "Topic ids are required.",
                    });
                }
                break;
            case examEngine_constant_1.ExamType.CHAPTER:
                if (!data.chapterId) {
                    ctx.addIssue({
                        code: zod_1.z.ZodIssueCode.custom,
                        path: ["chapterId"],
                        message: "Chapter id is required.",
                    });
                }
                break;
            case examEngine_constant_1.ExamType.SUBJECT:
                if (!data.subjectId) {
                    ctx.addIssue({
                        code: zod_1.z.ZodIssueCode.custom,
                        path: ["subjectId"],
                        message: "Subject id is required.",
                    });
                }
                break;
            case examEngine_constant_1.ExamType.PRACTICE_SET:
            case examEngine_constant_1.ExamType.MODEL_TEST:
                if (!data.sourceId) {
                    ctx.addIssue({
                        code: zod_1.z.ZodIssueCode.custom,
                        path: ["sourceId"],
                        message: "Source id is required.",
                    });
                }
                break;
            default:
                break;
        }
    }),
});
//# sourceMappingURL=examEngine.validation.js.map