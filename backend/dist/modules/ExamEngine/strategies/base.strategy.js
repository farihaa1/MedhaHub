"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseExamStrategy = void 0;
const timer_service_1 = require("../services/timer.service");
class BaseExamStrategy {
    buildConfiguration(questions, options) {
        return {
            questions,
            duration: options?.duration ?? timer_service_1.TimerService.calculateDuration(questions.length),
            totalMarks: options?.totalMarks ?? questions.length,
            negativeMark: options?.negativeMark ?? 0,
            shuffleQuestions: options?.shuffleQuestions ?? true,
            shuffleOptions: options?.shuffleOptions ?? true,
        };
    }
}
exports.BaseExamStrategy = BaseExamStrategy;
//# sourceMappingURL=base.strategy.js.map