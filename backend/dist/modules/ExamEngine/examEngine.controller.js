"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExamEngineController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../error/AppError"));
const catchAsync_1 = require("../../utils/catchAsync");
const sendResponse_1 = require("../../utils/sendResponse");
const examEngine_service_1 = require("./examEngine.service");
const startExam = (0, catchAsync_1.catchAsync)(async (req, res) => {
    if (!req.user) {
        throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, "Authentication required.");
    }
    console.log(req.user);
    const result = await examEngine_service_1.ExamEngineService.startExam({
        ...req.body,
        userId: req.user.id,
    });
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_1.default.CREATED,
        message: "Exam started successfully.",
        data: result,
    });
});
exports.ExamEngineController = {
    startExam,
};
//# sourceMappingURL=examEngine.controller.js.map