"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.customExamStrategy = void 0;
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../../error/AppError"));
const base_strategy_1 = require("./base.strategy");
const questionSelector_service_1 = require("../services/questionSelector.service");
const customExamStrategy = async (payload) => {
    if (!payload.topicIds?.length) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Topics are required.");
    }
    const questions = await questionSelector_service_1.QuestionSelectorService.selectQuestions({
        topicIds: payload.topicIds,
        count: payload.questionCount ?? 50,
    });
    return (0, base_strategy_1.buildExamConfiguration)(questions.map((question) => question._id));
};
exports.customExamStrategy = customExamStrategy;
//# sourceMappingURL=custom.strategy.js.map