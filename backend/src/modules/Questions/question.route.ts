import { Router } from "express";
import { QuestionController } from "./question.controller";
import { QuestionValidation } from "./question.validation";
import validateRequest from "../../utils/validateRequest";
import auth from "../../middlewares/auth";
import { UserRole } from "../users/user.constants";

const QuestionRoutes = Router();

// Create question
QuestionRoutes.post(
  "/",
  auth(UserRole.ADMIN, UserRole.USER),
  validateRequest(QuestionValidation.createQuestionValidationSchema),
  QuestionController.createQuestion,
);

// Bulk create questions
QuestionRoutes.post(
  "/bulk",
  auth(UserRole.ADMIN, UserRole.USER),
  validateRequest(QuestionValidation.bulkCreateQuestionValidationSchema),
  QuestionController.bulkCreateQuestions,
);

// Get all questions
QuestionRoutes.get("/", QuestionController.getAllQuestions);

// Question statistics
QuestionRoutes.get(
  "/stats",
  auth(UserRole.ADMIN),
  QuestionController.getQuestionStats,
);

// Get questions by topic
QuestionRoutes.get("/topic/:topicId", QuestionController.getQuestionsByTopic);

// Get single question
QuestionRoutes.get("/:id", QuestionController.getSingleQuestion);

// Update question
QuestionRoutes.patch(
  "/:id",
  auth(UserRole.ADMIN, UserRole.USER),
  validateRequest(QuestionValidation.updateQuestionValidationSchema),
  QuestionController.updateQuestion,
);

// Delete question
QuestionRoutes.delete(
  "/:id",
  auth(UserRole.ADMIN),
  QuestionController.deleteQuestion,
);

export default QuestionRoutes;
