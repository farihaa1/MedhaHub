"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PracticeSetStrategy = void 0;
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../../error/AppError"));
const base_strategy_1 = require("./base.strategy");
const practiceSet_model_1 = require("../../PracticeSets/practiceSet.model");
class PracticeSetStrategy extends base_strategy_1.BaseExamStrategy {
    async generateExam(payload) {
        if (!payload.sourceId) {
            throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Practice Set id is required.");
        }
        const practiceSet = await practiceSet_model_1.PracticeSet.findById(payload.sourceId);
        if (!practiceSet) {
            throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Practice Set not found.");
        }
        return this.buildConfiguration(practiceSet.questions, {
            duration: practiceSet.settings?.duration,
            negativeMark: practiceSet.settings?.negativeMark,
            shuffleQuestions: practiceSet.settings?.shuffleQuestions,
            shuffleOptions: practiceSet.settings?.shuffleOptions,
        });
    }
}
exports.PracticeSetStrategy = PracticeSetStrategy;
//# sourceMappingURL=practiceSet.strategy.js.map