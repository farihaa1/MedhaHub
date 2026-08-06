"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const validateRequest_1 = __importDefault(require("../../utils/validateRequest"));
const user_constants_1 = require("../users/user.constants");
const examSession_controller_1 = require("./examSession.controller");
const examSession_validation_1 = require("./examSession.validation");
const router = (0, express_1.Router)();
router.get("/:id", (0, auth_1.default)(user_constants_1.UserRole.USER, user_constants_1.UserRole.ADMIN), (0, validateRequest_1.default)(examSession_validation_1.getSessionValidationSchema), examSession_controller_1.ExamSessionController.getSession);
router.post("/:id/submit", (0, auth_1.default)(user_constants_1.UserRole.USER, user_constants_1.UserRole.ADMIN), (0, validateRequest_1.default)(examSession_validation_1.submitSessionValidationSchema), examSession_controller_1.ExamSessionController.submitSession);
router.post("/:id/answer", (0, auth_1.default)(user_constants_1.UserRole.USER, user_constants_1.UserRole.ADMIN), (0, validateRequest_1.default)(examSession_validation_1.submitAnswerValidationSchema), examSession_controller_1.ExamSessionController.submitAnswer);
exports.default = router;
//# sourceMappingURL=examSession.route.js.map