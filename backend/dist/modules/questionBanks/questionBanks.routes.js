"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const auth_1 = __importDefault(require("../../middlewares/auth"));
const questionBanks_controller_1 = require("./questionBanks.controller");
const questionBanks_validation_1 = require("./questionBanks.validation");
const user_constants_1 = require("../users/user.constants");
const validateRequest_1 = __importDefault(require("../../utils/validateRequest"));
const express_1 = require("express");
const QuestionBanksRoutes = (0, express_1.Router)();
/* ============================================================
   User + Admin
============================================================ */
// Create
QuestionBanksRoutes.post("/", (0, auth_1.default)(user_constants_1.UserRole.USER, user_constants_1.UserRole.ADMIN), (0, validateRequest_1.default)(questionBanks_validation_1.QuestionBanksValidation.createQuestionBanksValidationSchema), questionBanks_controller_1.QuestionBanksController.createQuestionBanks);
// Get All
QuestionBanksRoutes.get("/", questionBanks_controller_1.QuestionBanksController.getAllQuestionBanks);
// Get Single
QuestionBanksRoutes.get("/:identifier", questionBanks_controller_1.QuestionBanksController.getSingleQuestionBanks);
/* ============================================================
   Admin Only
============================================================ */
// Bulk Create
QuestionBanksRoutes.post("/bulk-create", (0, auth_1.default)(user_constants_1.UserRole.ADMIN), (0, validateRequest_1.default)(questionBanks_validation_1.QuestionBanksValidation.bulkCreateQuestionBanksValidationSchema), questionBanks_controller_1.QuestionBanksController.bulkCreateQuestionBanks);
/* ============================================================
   Import Questions Into Question Bank
============================================================ */
QuestionBanksRoutes.post("/:id/import", (0, auth_1.default)(user_constants_1.UserRole.ADMIN), questionBanks_controller_1.QuestionBanksController.importQuestions);
// Update
QuestionBanksRoutes.patch("/:id", (0, auth_1.default)(user_constants_1.UserRole.ADMIN), (0, validateRequest_1.default)(questionBanks_validation_1.QuestionBanksValidation.updateQuestionBanksValidationSchema), questionBanks_controller_1.QuestionBanksController.updateQuestionBanks);
// Publish
QuestionBanksRoutes.patch("/:id/publish", (0, auth_1.default)(user_constants_1.UserRole.ADMIN), (0, validateRequest_1.default)(questionBanks_validation_1.QuestionBanksValidation.publishQuestionBankValidationSchema), questionBanks_controller_1.QuestionBanksController.publishQuestionBanks);
// Reject
QuestionBanksRoutes.patch("/:id/reject", (0, auth_1.default)(user_constants_1.UserRole.ADMIN), (0, validateRequest_1.default)(questionBanks_validation_1.QuestionBanksValidation.rejectQuestionBankValidationSchema), questionBanks_controller_1.QuestionBanksController.rejectQuestionBanks);
// Archive
QuestionBanksRoutes.patch("/:id/archive", (0, auth_1.default)(user_constants_1.UserRole.ADMIN), (0, validateRequest_1.default)(questionBanks_validation_1.QuestionBanksValidation.archiveQuestionBankValidationSchema), questionBanks_controller_1.QuestionBanksController.archiveQuestionBanks);
// Restore
QuestionBanksRoutes.patch("/:id/restore", (0, auth_1.default)(user_constants_1.UserRole.ADMIN), (0, validateRequest_1.default)(questionBanks_validation_1.QuestionBanksValidation.restoreQuestionBankValidationSchema), questionBanks_controller_1.QuestionBanksController.restoreQuestionBanks);
// Delete
QuestionBanksRoutes.delete("/:id", (0, auth_1.default)(user_constants_1.UserRole.ADMIN), questionBanks_controller_1.QuestionBanksController.deleteQuestionBanks);
exports.default = QuestionBanksRoutes;
//# sourceMappingURL=questionBanks.routes.js.map