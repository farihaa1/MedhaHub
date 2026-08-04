import auth from "../../middlewares/auth";
import { QuestionBanksController } from "./questionBanks.controller";
import { QuestionBanksValidation } from "./questionBanks.validation";
import { UserRole } from "../users/user.constants";
import validateRequest from "../../utils/validateRequest";
import { Router } from "express";

const QuestionBanksRoutes = Router();

/* ============================================================
   User + Admin
============================================================ */

// Create
QuestionBanksRoutes.post(
  "/",
  auth(UserRole.USER, UserRole.ADMIN),
  validateRequest(QuestionBanksValidation.createQuestionBanksValidationSchema),
  QuestionBanksController.createQuestionBanks,
);

// Get All
QuestionBanksRoutes.get("/", QuestionBanksController.getAllQuestionBanks);

// Get Single
QuestionBanksRoutes.get(
  "/:identifier",
  QuestionBanksController.getSingleQuestionBanks,
);
/* ============================================================
   Admin Only
============================================================ */

// Bulk Create
QuestionBanksRoutes.post(
  "/bulk-create",
  auth(UserRole.ADMIN),
  validateRequest(
    QuestionBanksValidation.bulkCreateQuestionBanksValidationSchema,
  ),
  QuestionBanksController.bulkCreateQuestionBanks,
);

/* ============================================================
   Import Questions Into Question Bank
============================================================ */

QuestionBanksRoutes.post(
  "/:id/import",
  auth(UserRole.ADMIN),
  QuestionBanksController.importQuestions,
);

// Update
QuestionBanksRoutes.patch(
  "/:id",
  auth(UserRole.ADMIN),
  validateRequest(QuestionBanksValidation.updateQuestionBanksValidationSchema),
  QuestionBanksController.updateQuestionBanks,
);

// Publish
QuestionBanksRoutes.patch(
  "/:id/publish",
  auth(UserRole.ADMIN),
  validateRequest(QuestionBanksValidation.publishQuestionBankValidationSchema),
  QuestionBanksController.publishQuestionBanks,
);

// Reject
QuestionBanksRoutes.patch(
  "/:id/reject",
  auth(UserRole.ADMIN),
  validateRequest(QuestionBanksValidation.rejectQuestionBankValidationSchema),
  QuestionBanksController.rejectQuestionBanks,
);

// Archive
QuestionBanksRoutes.patch(
  "/:id/archive",
  auth(UserRole.ADMIN),
  validateRequest(QuestionBanksValidation.archiveQuestionBankValidationSchema),
  QuestionBanksController.archiveQuestionBanks,
);

// Restore
QuestionBanksRoutes.patch(
  "/:id/restore",
  auth(UserRole.ADMIN),
  validateRequest(QuestionBanksValidation.restoreQuestionBankValidationSchema),
  QuestionBanksController.restoreQuestionBanks,
);

// Delete
QuestionBanksRoutes.delete(
  "/:id",
  auth(UserRole.ADMIN),
  QuestionBanksController.deleteQuestionBanks,
);

export default QuestionBanksRoutes;
