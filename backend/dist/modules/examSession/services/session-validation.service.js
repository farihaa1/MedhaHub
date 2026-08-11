"use strict";
// modules/examSession/services/session-validation.service.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SessionValidationService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../../error/AppError"));
const examSession_utils_1 = require("../examSession.utils");
const ensureSessionIsRunning = async (session) => {
    if (!session) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Exam session not found.");
    }
    // ==========================================================
    // ALREADY SUBMITTED
    // ==========================================================
    if (session.submittedAt) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Exam has already been submitted.");
    }
    // ==========================================================
    // ALREADY ENDED
    // ==========================================================
    if (session.endTime) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Exam has already ended.");
    }
    // ==========================================================
    // TIME EXPIRED
    // ==========================================================
    if ((0, examSession_utils_1.hasSessionExpired)(session.startTime, session.duration)) {
        session.endTime = new Date();
        await session.save();
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Exam time has expired.");
    }
    return session;
};
exports.SessionValidationService = {
    ensureSessionIsRunning,
};
//# sourceMappingURL=session-validation.service.js.map