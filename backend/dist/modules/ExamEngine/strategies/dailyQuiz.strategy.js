"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dailyQuizStrategy = void 0;
const base_strategy_1 = require("./base.strategy");
const questionSelector_service_1 = require("../services/questionSelector.service");
const dailyQuizStrategy = async (_payload) => {
    const questions = await questionSelector_service_1.QuestionSelectorService.selectQuestions({
        count: 10,
    });
    return (0, base_strategy_1.buildExamConfiguration)(questions.map((question) => question._id), {
        duration: 10,
    });
};
exports.dailyQuizStrategy = dailyQuizStrategy;
//# sourceMappingURL=dailyQuiz.strategy.js.map