import express from "express";
import auth from "../../middlewares/auth";
import { QuestionBankItemController } from "./questionBankItem.controller";
import { QuestionBankItemValidation } from "./questionBankItem.validation";
import validateRequest from "../../utils/validateRequest";
import { UserRole } from "../users/user.constants";

const QuestionBankItemRoutes = express.Router();

QuestionBankItemRoutes.post(
  "/:questionBankId/questions",
  auth(UserRole.ADMIN),
  validateRequest(QuestionBankItemValidation.addQuestionValidationSchema),
  QuestionBankItemController.addQuestionToBank,
);

QuestionBankItemRoutes.post(
  "/:questionBankId/questions/bulk",
  auth(UserRole.ADMIN),
  validateRequest(QuestionBankItemValidation.bulkAddQuestionsValidationSchema),
  QuestionBankItemController.bulkAddQuestions,
);

QuestionBankItemRoutes.patch(
  "/items/:id",
  auth(UserRole.ADMIN),
  validateRequest(
    QuestionBankItemValidation.updateQuestionBankItemValidationSchema,
  ),
  QuestionBankItemController.updateQuestionBankItem,
);

QuestionBankItemRoutes.patch(
  "/:questionBankId/reorder",
  auth(UserRole.ADMIN),
  validateRequest(QuestionBankItemValidation.reorderQuestionsValidationSchema),
  QuestionBankItemController.reorderQuestions,
);

export default QuestionBankItemRoutes
