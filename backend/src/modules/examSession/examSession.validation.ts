// modules/examSession/examSession.validation.ts

import { z } from "zod";

const objectId = z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId");

// ============================================================
// GET SESSION
// ============================================================

export const getSessionValidationSchema = z.object({
  params: z.object({
    id: objectId,
  }),
});

// ============================================================
// SUBMIT SESSION
// ============================================================

export const submitSessionValidationSchema = z.object({
  params: z.object({
    id: objectId,
  }),
});

// ============================================================
// SUBMIT ANSWER
// ============================================================

export const submitAnswerValidationSchema = z.object({
  params: z.object({
    id: objectId,
  }),

  body: z.object({
    questionId: objectId,

    selectedOption: z.enum(["A", "B", "C", "D"]),

    timeTaken: z.number().min(0).optional(),
  }),
});
