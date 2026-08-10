"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.practiceSetStrategy = void 0;
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../../error/AppError"));
const practiceSet_model_1 = require("../../PracticeSets/practiceSet.model");
const base_strategy_1 = require("./base.strategy");
const practiceSetStrategy = async (payload) => {
    if (!payload.sourceId) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Practice Set id is required.");
    }
    const practiceSet = await practiceSet_model_1.PracticeSet.findById(payload.sourceId);
    if (!practiceSet) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Practice Set not found.");
    }
    return (0, base_strategy_1.buildExamConfiguration)(practiceSet.questions, {
        duration: practiceSet.settings?.duration,
        negativeMark: practiceSet.settings?.negativeMark,
        shuffleQuestions: practiceSet.settings?.shuffleQuestions,
        shuffleOptions: practiceSet.settings?.shuffleOptions,
    });
};
exports.practiceSetStrategy = practiceSetStrategy;
//# sourceMappingURL=practiceSet.strategy.js.map