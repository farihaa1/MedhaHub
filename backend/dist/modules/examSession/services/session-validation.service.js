"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SessionValidationService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../../error/AppError"));
const examSession_constant_1 = require("../examSession.constant");
const examSession_utils_1 = require("../examSession.utils");
const ensureSessionIsRunning = async (session) => {
    if ((0, examSession_utils_1.hasSessionExpired)(session.startTime, session.duration) &&
        session.status === examSession_constant_1.ExamSessionStatus.RUNNING) {
        session.status = examSession_constant_1.ExamSessionStatus.EXPIRED;
        session.endTime = new Date();
        await session.save();
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Exam time has expired.");
    }
    if (session.status !== examSession_constant_1.ExamSessionStatus.RUNNING) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Exam is no longer running.");
    }
};
exports.SessionValidationService = {
    ensureSessionIsRunning,
};
//# sourceMappingURL=session-validation.service.js.map