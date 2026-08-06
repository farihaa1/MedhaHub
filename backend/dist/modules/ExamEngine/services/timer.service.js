"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TimerService = void 0;
const calculateDuration = (questionCount, options) => {
    const minutePerQuestion = options?.minutePerQuestion ?? 1;
    const minimumDuration = options?.minimumDuration ?? 10;
    const duration = questionCount * minutePerQuestion;
    return Math.max(duration, minimumDuration);
};
const calculateRemainingTime = (startTime, duration) => {
    const elapsedSeconds = Math.floor((Date.now() - startTime.getTime()) / 1000);
    const remainingSeconds = duration * 60 - elapsedSeconds;
    return Math.max(remainingSeconds, 0);
};
const isExpired = (startTime, duration) => {
    return calculateRemainingTime(startTime, duration) <= 0;
};
exports.TimerService = {
    calculateDuration,
    calculateRemainingTime,
    isExpired,
};
//# sourceMappingURL=timer.service.js.map