import { Router } from "express";
import auth from "../../middlewares/auth";
import { QuestionBankController } from "./questionBank.controller";
import { QuestionBankValidation } from "./questionBank.validation";
import validateRequest from "../../utils/validateRequest";
import { UserRole } from "../users/user.constants";

const QuestionBankRoutes = Router();

/*
|--------------------------------------------------------------------------
| Public Routes
|--------------------------------------------------------------------------
*/

QuestionBankRoutes.get("/", QuestionBankController.getAllQuestionBanks);

QuestionBankRoutes.get("/:id", QuestionBankController.getSingleQuestionBank);

/*
|--------------------------------------------------------------------------
| Admin Routes
|--------------------------------------------------------------------------
*/

QuestionBankRoutes.post(
  "/",
  auth( UserRole.ADMIN),
  validateRequest(QuestionBankValidation.createQuestionBankValidationSchema),
  QuestionBankController.createQuestionBank,
);

QuestionBankRoutes.patch(
  "/:id",
  auth( UserRole.ADMIN),
  validateRequest(QuestionBankValidation.updateQuestionBankValidationSchema),
  QuestionBankController.updateQuestionBank,
);

QuestionBankRoutes.delete(
  "/:id",
  auth( UserRole.ADMIN),
  QuestionBankController.deleteQuestionBank,
);

export default QuestionBankRoutes;
