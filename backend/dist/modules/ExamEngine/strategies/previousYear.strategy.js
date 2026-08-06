"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PreviousYearStrategy = void 0;
const base_strategy_1 = require("./base.strategy");
const questionSelector_service_1 = require("../services/questionSelector.service");
class PreviousYearStrategy extends base_strategy_1.BaseExamStrategy {
    async generateExam(payload) {
        const questions = await questionSelector_service_1.QuestionSelectorService.selectQuestions({
            source: payload.source,
            year: payload.year,
            count: payload.questionCount ?? 200,
        });
        return this.buildConfiguration(questions.map((q) => q._id), {
            duration: 200,
            negativeMark: 0.25,
            shuffleQuestions: false,
            shuffleOptions: false,
        });
    }
}
exports.PreviousYearStrategy = PreviousYearStrategy;
//# sourceMappingURL=previousYear.strategy.js.map