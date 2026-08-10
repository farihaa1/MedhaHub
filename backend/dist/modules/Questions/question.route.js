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
// Create question
QuestionRoutes.post("/", (0, auth_1.default)(user_constants_1.UserRole.ADMIN, user_constants_1.UserRole.USER), (0, validateRequest_1.default)(question_validation_1.QuestionValidation.createQuestionValidationSchema), question_controller_1.QuestionController.createQuestion);
// Bulk create questions
QuestionRoutes.post("/bulk", (0, auth_1.default)(user_constants_1.UserRole.ADMIN, user_constants_1.UserRole.USER), (0, validateRequest_1.default)(question_validation_1.QuestionValidation.bulkCreateQuestionValidationSchema), question_controller_1.QuestionController.bulkCreateQuestions);
// Get all questions
QuestionRoutes.get("/", question_controller_1.QuestionController.getAllQuestions);
// Question statistics
QuestionRoutes.get("/stats", (0, auth_1.default)(user_constants_1.UserRole.ADMIN), question_controller_1.QuestionController.getQuestionStats);
// Get questions by topic
QuestionRoutes.get("/topic/:topicId", question_controller_1.QuestionController.getQuestionsByTopic);
// Get single question
QuestionRoutes.get("/:id", question_controller_1.QuestionController.getSingleQuestion);
// Update question
QuestionRoutes.patch("/:id", (0, auth_1.default)(user_constants_1.UserRole.ADMIN, user_constants_1.UserRole.USER), (0, validateRequest_1.default)(question_validation_1.QuestionValidation.updateQuestionValidationSchema), question_controller_1.QuestionController.updateQuestion);
// Delete question
QuestionRoutes.delete("/:id", (0, auth_1.default)(user_constants_1.UserRole.ADMIN), question_controller_1.QuestionController.deleteQuestion);
exports.default = QuestionRoutes;
//# sourceMappingURL=question.route.js.map