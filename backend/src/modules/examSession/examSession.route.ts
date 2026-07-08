import { Router } from "express";
import { ExamSessionController } from "./examSession.controller";

import {
  getSessionValidationSchema,
  submitSessionValidationSchema,
} from "./examSession.validation";
import validateRequest from "../../utils/validateRequest";

const ExamSessionRoutes = Router();

ExamSessionRoutes.get(
  "/:id",
  validateRequest(getSessionValidationSchema),
  ExamSessionController.getSession,
);

ExamSessionRoutes.post(
  "/:id/submit",
  validateRequest(submitSessionValidationSchema),
  ExamSessionController.submitSession,
);

export default ExamSessionRoutes;
