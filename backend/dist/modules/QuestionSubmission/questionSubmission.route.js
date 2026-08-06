"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const validateRequest_1 = __importDefault(require("../../utils/validateRequest"));
const user_constants_1 = require("../users/user.constants");
const questionSubmission_controller_1 = require("./questionSubmission.controller");
const questionSubmission_validation_1 = require("./questionSubmission.validation");
const QuestionSubmissionRoutes = (0, express_1.Router)();
/**
 * =========================================
 * User Routes
 * =========================================
 */
// Create Submission
QuestionSubmissionRoutes.post("/", (0, auth_1.default)(user_constants_1.UserRole.USER, user_constants_1.UserRole.ADMIN), (0, validateRequest_1.default)(questionSubmission_validation_1.QuestionSubmissionValidation.createQuestionSubmissionValidationSchema), questionSubmission_controller_1.QuestionSubmissionController.createSubmission);
// My Submissions
QuestionSubmissionRoutes.get("/my-submissions", (0, auth_1.default)(user_constants_1.UserRole.USER, user_constants_1.UserRole.ADMIN), questionSubmission_controller_1.QuestionSubmissionController.getMySubmissions);
/**
 * =========================================
 * Admin Routes
 * =========================================
 */
// Get All Submissions
QuestionSubmissionRoutes.get("/", (0, auth_1.default)(user_constants_1.UserRole.ADMIN), questionSubmission_controller_1.QuestionSubmissionController.getAllSubmissions);
// Get Single Submission
QuestionSubmissionRoutes.get("/:id", (0, auth_1.default)(user_constants_1.UserRole.ADMIN), questionSubmission_controller_1.QuestionSubmissionController.getSingleSubmission);
// Delete Submission
QuestionSubmissionRoutes.delete("/:id", (0, auth_1.default)(user_constants_1.UserRole.ADMIN), questionSubmission_controller_1.QuestionSubmissionController.deleteSubmission);
// Approve Submission
QuestionSubmissionRoutes.patch("/:id/approve", (0, auth_1.default)(user_constants_1.UserRole.ADMIN), questionSubmission_controller_1.QuestionSubmissionController.approve);
// Reject Submission
QuestionSubmissionRoutes.patch("/:id/reject", (0, auth_1.default)(user_constants_1.UserRole.ADMIN), (0, validateRequest_1.default)(questionSubmission_validation_1.QuestionSubmissionValidation.rejectSubmissionValidationSchema), questionSubmission_controller_1.QuestionSubmissionController.reject);
exports.default = QuestionSubmissionRoutes;
//# sourceMappingURL=questionSubmission.route.js.map