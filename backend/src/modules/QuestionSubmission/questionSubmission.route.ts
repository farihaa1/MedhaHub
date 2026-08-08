import { Router } from "express";

import auth from "../../middlewares/auth";

import validateRequest from "../../utils/validateRequest";

import { UserRole } from "../users/user.constants";

import { QuestionSubmissionController } from "./questionSubmission.controller";

import { QuestionSubmissionValidation } from "./questionSubmission.validation";

const QuestionSubmissionRoutes = Router();

/**
 * ============================================================
 * USER ROUTES
 * ============================================================
 */

/**
 * Create Submission
 */
QuestionSubmissionRoutes.post(
  "/",

  auth(UserRole.USER, UserRole.ADMIN),

  validateRequest(
    QuestionSubmissionValidation.createQuestionSubmissionValidationSchema,
  ),

  QuestionSubmissionController.createSubmission,
);

/**
 * My Submissions
 */
QuestionSubmissionRoutes.get(
  "/my-submissions",

  auth(UserRole.USER, UserRole.ADMIN),

  QuestionSubmissionController.getMySubmissions,
);

/**
 * ============================================================
 * ADMIN ROUTES
 * ============================================================
 */

/**
 * Get All
 */
QuestionSubmissionRoutes.get(
  "/",

  auth(UserRole.ADMIN),

  QuestionSubmissionController.getAllSubmissions,
);

/**
 * Get Single
 */
QuestionSubmissionRoutes.get(
  "/:id",

  auth(UserRole.ADMIN),

  QuestionSubmissionController.getSingleSubmission,
);

/**
 * Delete
 */
QuestionSubmissionRoutes.delete(
  "/:id",

  auth(UserRole.ADMIN),

  QuestionSubmissionController.deleteSubmission,
);

/**
 * Approve
 */
QuestionSubmissionRoutes.patch(
  "/:id/approve",

  auth(UserRole.ADMIN),

  QuestionSubmissionController.approve,
);

/**
 * Reject
 */
QuestionSubmissionRoutes.patch(
  "/:id/reject",

  auth(UserRole.ADMIN),

  validateRequest(
    QuestionSubmissionValidation.rejectSubmissionValidationSchema,
  ),

  QuestionSubmissionController.reject,
);

export default QuestionSubmissionRoutes;
