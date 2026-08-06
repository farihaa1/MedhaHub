"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateRemainingTime = exports.hasSessionExpired = exports.isSessionCompleted = exports.isSessionRunning = void 0;
const examSession_constant_1 = require("./examSession.constant");
const isSessionRunning = (status) => status === examSession_constant_1.ExamSessionStatus.RUNNING;
exports.isSessionRunning = isSessionRunning;
const isSessionCompleted = (status) => status === examSession_constant_1.ExamSessionStatus.SUBMITTED ||
    status === examSession_constant_1.ExamSessionStatus.EXPIRED;
exports.isSessionCompleted = isSessionCompleted;
const hasSessionExpired = (startTime, duration) => {
    const endTime = startTime.getTime() + duration * 60 * 1000;
    return Date.now() >= endTime;
};
exports.hasSessionExpired = hasSessionExpired;
const calculateRemainingTime = (startTime, duration) => {
    const elapsed = Math.floor((Date.now() - startTime.getTime()) / 1000);
    return Math.max(duration * 60 - elapsed, 0);
};
exports.calculateRemainingTime = calculateRemainingTime;
//# sourceMappingURL=examSession.utils.js.map