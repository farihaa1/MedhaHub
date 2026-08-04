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

const router = Router();

router.get(
  "/:id",
  auth(UserRole.USER, UserRole.ADMIN),
  validateRequest(getSessionValidationSchema),
  ExamSessionController.getSession,
);

router.post(
  "/:id/submit",
  auth(UserRole.USER, UserRole.ADMIN),
  validateRequest(submitSessionValidationSchema),
  ExamSessionController.submitSession,
);
router.post(
  "/:id/answer",
  auth(UserRole.USER, UserRole.ADMIN),
  validateRequest(submitAnswerValidationSchema),
  ExamSessionController.submitAnswer,
);
export default router;
