"use strict";
// modules/examSession/examSession.utils.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateRemainingTime = exports.hasSessionExpired = exports.calculateEndTime = exports.isSessionCompleted = exports.isSessionRunning = void 0;
const examSession_constant_1 = require("./examSession.constant");
// ============================================================
// STATUS HELPERS
// ============================================================
const isSessionRunning = (status) => {
    return status === examSession_constant_1.ExamSessionStatus.RUNNING;
};
exports.isSessionRunning = isSessionRunning;
const isSessionCompleted = (status) => {
    return (status === examSession_constant_1.ExamSessionStatus.SUBMITTED ||
        status === examSession_constant_1.ExamSessionStatus.EXPIRED);
};
exports.isSessionCompleted = isSessionCompleted;
// ============================================================
// END TIME
// ============================================================
const calculateEndTime = (startTime, duration) => {
    return new Date(startTime.getTime() + duration * 60 * 1000);
};
exports.calculateEndTime = calculateEndTime;
// ============================================================
// EXPIRATION
// ============================================================
const hasSessionExpired = (startTime, duration) => {
    const endTime = (0, exports.calculateEndTime)(startTime, duration);
    return Date.now() >= endTime.getTime();
};
exports.hasSessionExpired = hasSessionExpired;
// ============================================================
// REMAINING TIME
// ============================================================
const calculateRemainingTime = (startTime, duration) => {
    const endTime = (0, exports.calculateEndTime)(startTime, duration);
    const remainingMilliseconds = endTime.getTime() - Date.now();
    return Math.max(0, Math.ceil(remainingMilliseconds / 1000));
};
exports.calculateRemainingTime = calculateRemainingTime;
//# sourceMappingURL=examSession.utils.js.map