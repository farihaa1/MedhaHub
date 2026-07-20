import express from "express";
import auth from "../../middlewares/auth";
import { QuestionBankItemController } from "./questionBankItem.controller";
import { QuestionBankItemValidation } from "./questionBankItem.validation";
import validateRequest from "../../utils/validateRequest";
import { UserRole } from "../users/user.constants";

const QuestionBankItemRoutes = express.Router();

/**
 * Get all questions of a bank
 */
QuestionBankItemRoutes.get(
  "/:questionBankId/questions",
  QuestionBankItemController.getQuestionsByBank,
);

/**
 * Add one existing question
 */
QuestionBankItemRoutes.post(
  "/:questionBankId/questions",
  auth(UserRole.ADMIN),
  validateRequest(QuestionBankItemValidation.addQuestion),
  QuestionBankItemController.addQuestionToBank,
);

/**
 * Bulk add existing questions
 */
QuestionBankItemRoutes.post(
  "/:questionBankId/questions/bulk",
  auth(UserRole.ADMIN),
  validateRequest(QuestionBankItemValidation.bulkAddQuestions),
  QuestionBankItemController.bulkAddQuestions,
);

/**
 * Update question settings inside bank
 */
QuestionBankItemRoutes.patch(
  "/items/:id",
  auth(UserRole.ADMIN),
  validateRequest(QuestionBankItemValidation.updateQuestionBankItem),
  QuestionBankItemController.updateQuestionBankItem,
);

/**
 * Remove question from bank
 */
QuestionBankItemRoutes.delete(
  "/:questionBankId/questions/:questionId",
  auth(UserRole.ADMIN),
  QuestionBankItemController.removeQuestionFromBank,
);

/**
 * Reorder questions
 */
QuestionBankItemRoutes.patch(
  "/:questionBankId/reorder",
  auth(UserRole.ADMIN),
  validateRequest(QuestionBankItemValidation.reorderQuestions),
  QuestionBankItemController.reorderQuestions,
);

export default QuestionBankItemRoutes
