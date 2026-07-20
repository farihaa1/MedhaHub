import { Router } from "express";
import validateRequest from "../../utils/validateRequest";
import auth from "../../middlewares/auth";
import { QuestionSubmissionController } from "./questionSubmission.controller";
import { QuestionSubmissionValidation } from "./questionSubmission.validation";
import { UserRole } from "../users/user.constants";

const QuestionSubmissionRoutes = Router();

// USER
QuestionSubmissionRoutes.post(
  "/",
   auth(UserRole.USER, UserRole.ADMIN),
  validateRequest(
    QuestionSubmissionValidation.createQuestionSubmissionValidationSchema,
  ),
  QuestionSubmissionController.createSubmission,
);

// ADMIN
QuestionSubmissionRoutes.get(
  "/",
  auth("ADMIN"),
  QuestionSubmissionController.getAllSubmissions,
);

QuestionSubmissionRoutes.get(
  "/:id",
  auth("ADMIN"),
  QuestionSubmissionController.getSingleSubmission,
);

QuestionSubmissionRoutes.delete(
  "/:id",
  auth("ADMIN"),
  QuestionSubmissionController.deleteSubmission,
);

QuestionSubmissionRoutes.patch(
  "/:id/approve",
  auth("ADMIN"),
  QuestionSubmissionController.approve,
);

QuestionSubmissionRoutes.patch(
  "/:id/reject",
  auth("ADMIN"),
  validateRequest(
    QuestionSubmissionValidation.rejectSubmissionValidationSchema,
  ),
  QuestionSubmissionController.reject,
);

export default QuestionSubmissionRoutes;
