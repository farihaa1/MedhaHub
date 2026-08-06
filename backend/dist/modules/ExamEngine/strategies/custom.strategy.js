"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomExamStrategy = void 0;
const questionSelector_service_1 = require("../services/questionSelector.service");
const timer_service_1 = require("../services/timer.service");
class CustomExamStrategy {
    async generateExam(payload) {
        if (!payload.topicIds?.length) {
            throw new Error("Topics are required");
        }
        const questions = await questionSelector_service_1.QuestionSelectorService.selectQuestions({
            topicIds: payload.topicIds,
            count: payload.questionCount ?? 50,
        });
        return {
            questions: questions.map((q) => q._id),
            duration: timer_service_1.TimerService.calculateDuration(questions.length),
            totalMarks: questions.length,
            negativeMark: 0,
            shuffleQuestions: true,
            shuffleOptions: true,
        };
    }
}
exports.CustomExamStrategy = CustomExamStrategy;
//# sourceMappingURL=custom.strategy.js.map