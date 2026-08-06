"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DailyQuizStrategy = void 0;
const base_strategy_1 = require("./base.strategy");
const questionSelector_service_1 = require("../services/questionSelector.service");
class DailyQuizStrategy extends base_strategy_1.BaseExamStrategy {
    async generateExam(_payload) {
        const questions = await questionSelector_service_1.QuestionSelectorService.selectQuestions({
            count: 10,
        });
        return this.buildConfiguration(questions.map((q) => q._id), {
            duration: 10,
        });
    }
}
exports.DailyQuizStrategy = DailyQuizStrategy;
//# sourceMappingURL=dailyQuiz.strategy.js.map