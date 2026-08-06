"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const questionBankItem_controller_1 = require("./questionBankItem.controller");
const questionBankItem_validation_1 = require("./questionBankItem.validation");
const validateRequest_1 = __importDefault(require("../../utils/validateRequest"));
const user_constants_1 = require("../users/user.constants");
const QuestionBankItemRoutes = express_1.default.Router();
QuestionBankItemRoutes.post("/:questionBankId/questions", (0, auth_1.default)(user_constants_1.UserRole.ADMIN), (0, validateRequest_1.default)(questionBankItem_validation_1.QuestionBankItemValidation.addQuestionValidationSchema), questionBankItem_controller_1.QuestionBankItemController.addQuestionToBank);
QuestionBankItemRoutes.post("/:questionBankId/questions/bulk", (0, auth_1.default)(user_constants_1.UserRole.ADMIN), (0, validateRequest_1.default)(questionBankItem_validation_1.QuestionBankItemValidation.bulkAddQuestionsValidationSchema), questionBankItem_controller_1.QuestionBankItemController.bulkAddQuestions);
QuestionBankItemRoutes.patch("/items/:id", (0, auth_1.default)(user_constants_1.UserRole.ADMIN), (0, validateRequest_1.default)(questionBankItem_validation_1.QuestionBankItemValidation.updateQuestionBankItemValidationSchema), questionBankItem_controller_1.QuestionBankItemController.updateQuestionBankItem);
QuestionBankItemRoutes.patch("/:questionBankId/reorder", (0, auth_1.default)(user_constants_1.UserRole.ADMIN), (0, validateRequest_1.default)(questionBankItem_validation_1.QuestionBankItemValidation.reorderQuestionsValidationSchema), questionBankItem_controller_1.QuestionBankItemController.reorderQuestions);
QuestionBankItemRoutes.get("/:questionBankId/questions", questionBankItem_controller_1.QuestionBankItemController.getQuestionsByBank);
QuestionBankItemRoutes.delete("/:questionBankId/questions/:questionId", (0, auth_1.default)(user_constants_1.UserRole.ADMIN), questionBankItem_controller_1.QuestionBankItemController.removeQuestionFromBank);
exports.default = QuestionBankItemRoutes;
//# sourceMappingURL=questionBankItem.route.js.map