import { Router } from "express";

import auth from "../../middlewares/auth";
import validateRequest from "../../utils/validateRequest";

import { UserRole } from "../users/user.constants";

import { QuestionSubmissionController } from "./questionSubmission.controller";
import { QuestionSubmissionValidation } from "./questionSubmission.validation";

const QuestionSubmissionRoutes = Router();

/**
 * =========================================
 * User Routes
 * =========================================
 */

// Create Submission
QuestionSubmissionRoutes.post(
  "/",
  auth(UserRole.USER, UserRole.ADMIN),
  validateRequest(
    QuestionSubmissionValidation.createQuestionSubmissionValidationSchema,
  ),
  QuestionSubmissionController.createSubmission,
);

// My Submissions
QuestionSubmissionRoutes.get(
  "/my-submissions",
  auth(UserRole.USER, UserRole.ADMIN),
  QuestionSubmissionController.getMySubmissions,
);

/**
 * =========================================
 * Admin Routes
 * =========================================
 */

// Get All Submissions
QuestionSubmissionRoutes.get(
  "/",
  auth(UserRole.ADMIN),
  QuestionSubmissionController.getAllSubmissions,
);

// Get Single Submission
QuestionSubmissionRoutes.get(
  "/:id",
  auth(UserRole.ADMIN),
  QuestionSubmissionController.getSingleSubmission,
);

// Delete Submission
QuestionSubmissionRoutes.delete(
  "/:id",
  auth(UserRole.ADMIN),
  QuestionSubmissionController.deleteSubmission,
);

// Approve Submission
QuestionSubmissionRoutes.patch(
  "/:id/approve",
  auth(UserRole.ADMIN),
  QuestionSubmissionController.approve,
);

// Reject Submission
QuestionSubmissionRoutes.patch(
  "/:id/reject",
  auth(UserRole.ADMIN),
  validateRequest(
    QuestionSubmissionValidation.rejectSubmissionValidationSchema,
  ),
  QuestionSubmissionController.reject,
);

export default QuestionSubmissionRoutes;
