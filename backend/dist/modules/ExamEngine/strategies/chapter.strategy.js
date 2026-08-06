"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChapterExamStrategy = void 0;
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../../error/AppError"));
const base_strategy_1 = require("./base.strategy");
const questionSelector_service_1 = require("../services/questionSelector.service");
class ChapterExamStrategy extends base_strategy_1.BaseExamStrategy {
    async generateExam(payload) {
        if (!payload.chapterId) {
            throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Chapter id is required.");
        }
        const questions = await questionSelector_service_1.QuestionSelectorService.selectQuestions({
            chapterId: payload.chapterId,
            count: payload.questionCount ?? 50,
        });
        return this.buildConfiguration(questions.map((question) => question._id));
    }
}
exports.ChapterExamStrategy = ChapterExamStrategy;
//# sourceMappingURL=chapter.strategy.js.map