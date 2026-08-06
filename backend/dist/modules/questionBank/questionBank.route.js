"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const questionBank_controller_1 = require("./questionBank.controller");
const questionBank_validation_1 = require("./questionBank.validation");
const validateRequest_1 = __importDefault(require("../../utils/validateRequest"));
const user_constants_1 = require("../users/user.constants");
const QuestionBankRoutes = (0, express_1.Router)();
/*
|--------------------------------------------------------------------------
| Public Routes
|--------------------------------------------------------------------------
*/
QuestionBankRoutes.get("/", questionBank_controller_1.QuestionBankController.getAllQuestionBanks);
QuestionBankRoutes.get("/:id", questionBank_controller_1.QuestionBankController.getSingleQuestionBank);
/*
|--------------------------------------------------------------------------
| Admin Routes
|--------------------------------------------------------------------------
*/
QuestionBankRoutes.post("/", (0, auth_1.default)(user_constants_1.UserRole.ADMIN), (0, validateRequest_1.default)(questionBank_validation_1.QuestionBankValidation.createQuestionBankValidationSchema), questionBank_controller_1.QuestionBankController.createQuestionBank);
QuestionBankRoutes.patch("/:id", (0, auth_1.default)(user_constants_1.UserRole.ADMIN), (0, validateRequest_1.default)(questionBank_validation_1.QuestionBankValidation.updateQuestionBankValidationSchema), questionBank_controller_1.QuestionBankController.updateQuestionBank);
QuestionBankRoutes.delete("/:id", (0, auth_1.default)(user_constants_1.UserRole.ADMIN), questionBank_controller_1.QuestionBankController.deleteQuestionBank);
exports.default = QuestionBankRoutes;
//# sourceMappingURL=questionBank.route.js.map