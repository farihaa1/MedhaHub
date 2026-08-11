"use strict";
// modules/examSession/examSession.utils.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.isSessionEnded = exports.isSessionSubmitted = exports.calculateRemainingTime = exports.hasSessionExpired = exports.calculateEndTime = void 0;
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
// ============================================================
// SESSION COMPLETION
// ============================================================
const isSessionSubmitted = (submittedAt) => {
    return Boolean(submittedAt);
};
exports.isSessionSubmitted = isSessionSubmitted;
const isSessionEnded = (endTime) => {
    return Boolean(endTime);
};
exports.isSessionEnded = isSessionEnded;
//# sourceMappingURL=examSession.utils.js.map