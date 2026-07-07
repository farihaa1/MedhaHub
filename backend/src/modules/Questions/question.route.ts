import { Router } from "express";
import { QuestionController } from "./question.controller";
import { QuestionValidation } from "./question.validation";
import validateRequest from "../../utils/validateRequest";

const QuestionRoutes = Router();

QuestionRoutes.post(
  "/",
  validateRequest(QuestionValidation.createQuestionValidationSchema),
  QuestionController.createQuestion,
);

QuestionRoutes.get("/", QuestionController.getAllQuestions);

QuestionRoutes.get("/topic/:topicId", QuestionController.getQuestionsByTopic);

QuestionRoutes.get("/:id", QuestionController.getSingleQuestion);

QuestionRoutes.patch(
  "/:id",
  validateRequest(QuestionValidation.updateQuestionValidationSchema),
  QuestionController.updateQuestion,
);

QuestionRoutes.delete("/:id", QuestionController.deleteQuestion);

export default QuestionRoutes;
