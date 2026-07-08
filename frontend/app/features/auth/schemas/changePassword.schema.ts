import { z } from "zod"

export const changePasswordSchema = z
  .object({
    currentPassword: z.string(),

    newPassword: z.string().min(8, "Password must be at least 8 characters"),

    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  })

export type ChangePasswordInput = z.infer<typeof changePasswordSchema>
