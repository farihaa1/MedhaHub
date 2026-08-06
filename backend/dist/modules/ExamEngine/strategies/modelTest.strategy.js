"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModelTestStrategy = void 0;
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../../error/AppError"));
const base_strategy_1 = require("./base.strategy");
const modelTest_model_1 = require("../../ModelTests/modelTest.model");
const modelTest_utils_1 = require("../../ModelTests/modelTest.utils");
class ModelTestStrategy extends base_strategy_1.BaseExamStrategy {
    async generateExam(payload) {
        if (!payload.sourceId) {
            throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Model Test id is required.");
        }
        const modelTest = await modelTest_model_1.ModelTest.findById(payload.sourceId);
        if (!modelTest) {
            throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Model Test not found.");
        }
        const available = (0, modelTest_utils_1.isModelTestAvailable)(modelTest.schedule?.startDate, modelTest.schedule?.endDate);
        if (!available) {
            throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Model Test is unavailable.");
        }
        return this.buildConfiguration(modelTest.questions, {
            duration: modelTest.settings.duration,
            negativeMark: modelTest.settings.negativeMark,
            shuffleQuestions: modelTest.settings.shuffleQuestions,
            shuffleOptions: modelTest.settings.shuffleOptions,
        });
    }
}
exports.ModelTestStrategy = ModelTestStrategy;
//# sourceMappingURL=modelTest.strategy.js.map