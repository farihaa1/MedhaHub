import { Router } from "express";

import { QuestionController } from "./question.controller";
import { QuestionValidation } from "./question.validation";

import validateRequest from "../../utils/validateRequest";
import auth from "../../middlewares/auth";

import { UserRole } from "../users/user.constants";

const QuestionRoutes = Router();

// =========================================================
// CREATE QUESTION
// =========================================================

QuestionRoutes.post(
  "/",
  auth(UserRole.ADMIN, UserRole.USER),
  validateRequest(QuestionValidation.createQuestionValidationSchema),
  QuestionController.createQuestion,
);

// =========================================================
// BULK CREATE QUESTIONS
// =========================================================

QuestionRoutes.post(
  "/bulk",
  auth(UserRole.ADMIN, UserRole.USER),
  validateRequest(QuestionValidation.bulkCreateQuestionValidationSchema),
  QuestionController.bulkCreateQuestions,
);

// =========================================================
// GET ALL QUESTIONS
// =========================================================

QuestionRoutes.get("/", QuestionController.getAllQuestions);

// =========================================================
// QUESTION STATISTICS
// =========================================================

QuestionRoutes.get(
  "/stats",
  auth(UserRole.ADMIN),
  QuestionController.getQuestionStats,
);

// =========================================================
// GET QUESTIONS BY TOPIC
// =========================================================

QuestionRoutes.get("/topic/:topicId", QuestionController.getQuestionsByTopic);

// =========================================================
// GET SINGLE QUESTION
// =========================================================

QuestionRoutes.get("/:id", QuestionController.getSingleQuestion);

// =========================================================
// UPDATE QUESTION
// =========================================================

QuestionRoutes.patch(
  "/:id",
  auth(UserRole.ADMIN, UserRole.USER),
  validateRequest(QuestionValidation.updateQuestionValidationSchema),
  QuestionController.updateQuestion,
);

// =========================================================
// DELETE QUESTION
// =========================================================

QuestionRoutes.delete(
  "/:id",
  auth(UserRole.ADMIN),
  QuestionController.deleteQuestion,
);

export default QuestionRoutes;
