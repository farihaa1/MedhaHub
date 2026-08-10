"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.previousYearStrategy = void 0;
const base_strategy_1 = require("./base.strategy");
const questionSelector_service_1 = require("../services/questionSelector.service");
const previousYearStrategy = async (payload) => {
    const questions = await questionSelector_service_1.QuestionSelectorService.selectQuestions({
        source: payload.source,
        year: payload.year,
        count: payload.questionCount ?? 200,
    });
    return (0, base_strategy_1.buildExamConfiguration)(questions.map((question) => question._id), {
        duration: 200,
        negativeMark: 0.25,
        shuffleQuestions: false,
        shuffleOptions: false,
    });
};
exports.previousYearStrategy = previousYearStrategy;
//# sourceMappingURL=previousYear.strategy.js.map