"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthValidation = void 0;
const zod_1 = require("zod");
const registerValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z
            .string()
            .min(3, "Name must be at least 3 characters")
            .max(50, "Name is too long"),
        email: zod_1.z.string().email("Invalid email address"),
        password: zod_1.z.string().min(6, "Password must be at least 6 characters"),
        phone: zod_1.z.string().optional(),
    }),
});
const loginValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.string().email("Invalid email address"),
        password: zod_1.z.string().min(6, "Password must be at least 6 characters"),
    }),
});
const changePasswordValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        oldPassword: zod_1.z
            .string()
            .min(6, "Old password must be at least 6 characters"),
        newPassword: zod_1.z
            .string()
            .min(6, "New password must be at least 6 characters"),
    }),
});
const updateProfileValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().min(3).optional(),
        phone: zod_1.z.string().optional(),
        avatar: zod_1.z.string().url("Invalid image URL").optional(),
    }),
});
exports.AuthValidation = {
    registerValidationSchema,
    loginValidationSchema,
    changePasswordValidationSchema,
    updateProfileValidationSchema,
};
//# sourceMappingURL=auth.validation.js.map