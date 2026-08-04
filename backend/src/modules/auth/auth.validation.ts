import { z } from "zod";

const registerValidationSchema = z.object({
  body: z.object({
    name: z
      .string()
      .min(3, "Name must be at least 3 characters")
      .max(50, "Name is too long"),

    email: z.string().email("Invalid email address"),

    password: z.string().min(6, "Password must be at least 6 characters"),

    phone: z.string().optional(),
  }),
});

const loginValidationSchema = z.object({
  body: z.object({
    email: z.string().email("Invalid email address"),

    password: z.string().min(6, "Password must be at least 6 characters"),
  }),
});

const changePasswordValidationSchema = z.object({
  body: z.object({
    oldPassword: z
      .string()
      .min(6, "Old password must be at least 6 characters"),

    newPassword: z
      .string()
      .min(6, "New password must be at least 6 characters"),
  }),
});

const updateProfileValidationSchema = z.object({
  body: z.object({
    name: z.string().min(3).optional(),

    phone: z.string().optional(),

    avatar: z.string().url("Invalid image URL").optional(),
  }),
});

export const AuthValidation = {
  registerValidationSchema,
  loginValidationSchema,
  changePasswordValidationSchema,
  updateProfileValidationSchema,
};
