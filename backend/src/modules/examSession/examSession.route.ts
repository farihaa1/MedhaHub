// modules/examSession/examSession.routes.ts

import { Router } from "express";

import auth from "../../middlewares/auth";

import validateRequest from "../../utils/validateRequest";

import { UserRole } from "../users/user.constants";

import { ExamSessionController } from "./examSession.controller";

import {
  getSessionValidationSchema,
  submitAnswerValidationSchema,
  submitSessionValidationSchema,
} from "./examSession.validation";

const ExamSessionRoutes = Router();

// ============================================================
// GET SESSION
// ============================================================

ExamSessionRoutes.get(
  "/:id",
  auth(UserRole.USER, UserRole.ADMIN),
  validateRequest(getSessionValidationSchema),
  ExamSessionController.getSession,
);

// ============================================================
// SUBMIT ANSWER
// ============================================================

ExamSessionRoutes.post(
  "/:id/answer",
  auth(UserRole.USER, UserRole.ADMIN),
  validateRequest(submitAnswerValidationSchema),
  ExamSessionController.submitAnswer,
);

// ============================================================
// SUBMIT EXAM
// ============================================================

ExamSessionRoutes.post(
  "/:id/submit",
  auth(UserRole.USER, UserRole.ADMIN),
  validateRequest(submitSessionValidationSchema),
  ExamSessionController.submitSession,
);

export default ExamSessionRoutes;
