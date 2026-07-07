import { z } from "zod";
import { AuthProvider } from "../auth/auth.constant";

export const createUserValidationSchema = z.object({
  body: z.object({
    name: z.string().min(3, "Name must be at least 3 characters").max(50),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    provider: z.nativeEnum(AuthProvider).optional(),
    phone: z.string().optional(),
    profileImage: z.string().optional(),
  }),
});

export const updateUserValidationSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    phone: z.string().optional(),
    profileImage: z.string().optional(),
  }),
});
