"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const question_controller_1 = require("./question.controller");
const question_validation_1 = require("./question.validation");
const validateRequest_1 = __importDefault(require("../../utils/validateRequest"));
const QuestionRoutes = (0, express_1.Router)();
QuestionRoutes.post("/", (0, validateRequest_1.default)(question_validation_1.QuestionValidation.createQuestionValidationSchema), question_controller_1.QuestionController.createQuestion);
QuestionRoutes.post("/bulk", (0, validateRequest_1.default)(question_validation_1.QuestionValidation.bulkCreateQuestionValidationSchema), question_controller_1.QuestionController.bulkCreateQuestions);
QuestionRoutes.get("/", question_controller_1.QuestionController.getAllQuestions);
QuestionRoutes.get("/stats", question_controller_1.QuestionController.getQuestionStats);
QuestionRoutes.get("/topic/:topicId", question_controller_1.QuestionController.getQuestionsByTopic);
QuestionRoutes.get("/:id", question_controller_1.QuestionController.getSingleQuestion);
QuestionRoutes.patch("/:id", (0, validateRequest_1.default)(question_validation_1.QuestionValidation.updateQuestionValidationSchema), question_controller_1.QuestionController.updateQuestion);
QuestionRoutes.delete("/:id", question_controller_1.QuestionController.deleteQuestion);
exports.default = QuestionRoutes;
//# sourceMappingURL=question.route.js.map