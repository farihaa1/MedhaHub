import { z } from "zod";

const objectId = z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId");

export const getSessionValidationSchema = z.object({
  params: z.object({
    id: objectId,
  }),
});

export const submitSessionValidationSchema = z.object({
  params: z.object({
    id: objectId,
  }),
});
