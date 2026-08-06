"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const examEngine_controller_1 = require("./examEngine.controller");
const examEngine_validation_1 = require("./examEngine.validation");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const validateRequest_1 = __importDefault(require("../../utils/validateRequest"));
const user_constants_1 = require("../users/user.constants");
const ExamEngineRoutes = express_1.default.Router();
ExamEngineRoutes.post("/start", (0, auth_1.default)(user_constants_1.UserRole.USER, user_constants_1.UserRole.ADMIN), (0, validateRequest_1.default)(examEngine_validation_1.startExamValidationSchema), examEngine_controller_1.ExamEngineController.startExam);
// ExamEngineRoutes.post("/start", ExamEngineController.startExam);
// ExamEngineRoutes.post("/preview", ExamEngineController.previewExam);
exports.default = ExamEngineRoutes;
//# sourceMappingURL=examEngine.route.js.map