"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const question_controller_1 = require("./question.controller");
const question_validation_1 = require("./question.validation");
const validateRequest_1 = __importDefault(require("../../utils/validateRequest"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const user_constants_1 = require("../users/user.constants");
const QuestionRoutes = (0, express_1.Router)();
/* =========================================================
   CREATE QUESTION
========================================================= */
QuestionRoutes.post("/", (0, auth_1.default)(user_constants_1.UserRole.ADMIN, user_constants_1.UserRole.USER), (0, validateRequest_1.default)(question_validation_1.QuestionValidation.createQuestionValidationSchema), question_controller_1.QuestionController.createQuestion);
/* =========================================================
   BULK CREATE QUESTIONS
========================================================= */
QuestionRoutes.post("/bulk", (0, auth_1.default)(user_constants_1.UserRole.ADMIN, user_constants_1.UserRole.USER), (0, validateRequest_1.default)(question_validation_1.QuestionValidation.bulkCreateQuestionValidationSchema), question_controller_1.QuestionController.bulkCreateQuestions);
/* =========================================================
   GET ALL QUESTIONS
========================================================= */
QuestionRoutes.get("/", question_controller_1.QuestionController.getAllQuestions);
/* =========================================================
   QUESTION STATISTICS
========================================================= */
QuestionRoutes.get("/stats", (0, auth_1.default)(user_constants_1.UserRole.ADMIN), question_controller_1.QuestionController.getQuestionStats);
/* =========================================================
   GET QUESTIONS BY TOPIC
========================================================= */
QuestionRoutes.get("/topic/:topicId", question_controller_1.QuestionController.getQuestionsByTopic);
/* =========================================================
   GET SINGLE QUESTION
========================================================= */
QuestionRoutes.get("/:id", question_controller_1.QuestionController.getSingleQuestion);
/* =========================================================
   UPDATE QUESTION
========================================================= */
QuestionRoutes.patch("/:id", (0, auth_1.default)(user_constants_1.UserRole.ADMIN, user_constants_1.UserRole.USER), (0, validateRequest_1.default)(question_validation_1.QuestionValidation.updateQuestionValidationSchema), question_controller_1.QuestionController.updateQuestion);
/* =========================================================
   DELETE QUESTION
========================================================= */
QuestionRoutes.delete("/:id", (0, auth_1.default)(user_constants_1.UserRole.ADMIN), question_controller_1.QuestionController.deleteQuestion);
exports.default = QuestionRoutes;
//# sourceMappingURL=question.route.js.map