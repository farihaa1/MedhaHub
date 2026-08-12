import { Router } from "express";

import { QuestionController } from "./question.controller";
import { QuestionValidation } from "./question.validation";

import validateRequest from "../../utils/validateRequest";
import auth from "../../middlewares/auth";
import { UserRole } from "../users/user.constants";

const QuestionRoutes = Router();

/* =========================================================
   CREATE QUESTION
========================================================= */

QuestionRoutes.post(
  "/",
  auth(UserRole.ADMIN, UserRole.USER),
  validateRequest(QuestionValidation.createQuestionValidationSchema),
  QuestionController.createQuestion,
);

/* =========================================================
   BULK CREATE QUESTIONS
========================================================= */

QuestionRoutes.post(
  "/bulk",
  auth(UserRole.ADMIN, UserRole.USER),
  validateRequest(QuestionValidation.bulkCreateQuestionValidationSchema),
  QuestionController.bulkCreateQuestions,
);

/* =========================================================
   GET ALL QUESTIONS
   Public
========================================================= */

QuestionRoutes.get("/", QuestionController.getAllQuestions);

/* =========================================================
   QUESTION STATISTICS
   ADMIN ONLY
========================================================= */

QuestionRoutes.get(
  "/stats",
  auth(UserRole.ADMIN),
  QuestionController.getQuestionStats,
);

/* =========================================================
   GET QUESTIONS BY TOPIC
   Public
========================================================= */

QuestionRoutes.get("/topic/:topicId", QuestionController.getQuestionsByTopic);

/* =========================================================
   GET SINGLE QUESTION
   Public
========================================================= */

QuestionRoutes.get("/:id", QuestionController.getSingleQuestion);

/* =========================================================
   UPDATE QUESTION
   ADMIN + USER
========================================================= */

QuestionRoutes.patch(
  "/:id",
  auth(UserRole.ADMIN, UserRole.USER),
  validateRequest(QuestionValidation.updateQuestionValidationSchema),
  QuestionController.updateQuestion,
);

/* =========================================================
   DELETE QUESTION
   ADMIN ONLY
========================================================= */

QuestionRoutes.delete(
  "/:id",
  auth(UserRole.ADMIN),
  QuestionController.deleteQuestion,
);

export default QuestionRoutes;
