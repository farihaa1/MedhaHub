"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserValidationSchema = exports.createUserValidationSchema = void 0;
const zod_1 = require("zod");
const auth_constant_1 = require("../auth/auth.constant");
exports.createUserValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().min(3, "Name must be at least 3 characters").max(50),
        email: zod_1.z.string().email("Invalid email address"),
        password: zod_1.z.string().min(6, "Password must be at least 6 characters"),
        provider: zod_1.z.nativeEnum(auth_constant_1.AuthProvider).optional(),
        phone: zod_1.z.string().optional(),
        profileImage: zod_1.z.string().optional(),
    }),
});
exports.updateUserValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().optional(),
        phone: zod_1.z.string().optional(),
        profileImage: zod_1.z.string().optional(),
    }),
});
//# sourceMappingURL=user.validation.js.map