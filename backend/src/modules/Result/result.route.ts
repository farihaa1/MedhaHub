import { Router } from "express";

import auth from "../../middlewares/auth";
import validateRequest from "../../utils/validateRequest";

import { UserRole } from "../users/user.constants";
import { ResultController } from "./result.controller";

const ResultRoutes = Router();

// ============================================================
// GET RESULT REVIEW
// GET /api/v1/result/:sessionId
// ============================================================

ResultRoutes.get(
  "/:sessionId",
  auth(UserRole.USER, UserRole.ADMIN),
  ResultController.getResultReview,
);

export default ResultRoutes;
