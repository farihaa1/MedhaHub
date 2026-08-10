"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getExamStrategy = void 0;
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../../error/AppError"));
const examEngine_constant_1 = require("../examEngine.constant");
const topic_strategy_1 = require("../strategies/topic.strategy");
const chapter_strategy_1 = require("../strategies/chapter.strategy");
const subject_strategy_1 = require("../strategies/subject.strategy");
const practiceSet_strategy_1 = require("../strategies/practiceSet.strategy");
const modelTest_strategy_1 = require("../strategies/modelTest.strategy");
const previousYear_strategy_1 = require("../strategies/previousYear.strategy");
const dailyQuiz_strategy_1 = require("../strategies/dailyQuiz.strategy");
const getExamStrategy = (type) => {
    switch (type) {
        case examEngine_constant_1.ExamType.TOPIC:
            return topic_strategy_1.topicExamStrategy;
        case examEngine_constant_1.ExamType.CHAPTER:
            return chapter_strategy_1.chapterExamStrategy;
        case examEngine_constant_1.ExamType.SUBJECT:
            return subject_strategy_1.subjectExamStrategy;
        case examEngine_constant_1.ExamType.PRACTICE_SET:
            return practiceSet_strategy_1.practiceSetStrategy;
        case examEngine_constant_1.ExamType.MODEL_TEST:
            return modelTest_strategy_1.modelTestStrategy;
        case examEngine_constant_1.ExamType.PREVIOUS_YEAR:
            return previousYear_strategy_1.previousYearStrategy;
        case examEngine_constant_1.ExamType.DAILY:
            return dailyQuiz_strategy_1.dailyQuizStrategy;
        default:
            throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Unsupported exam type.");
    }
};
exports.getExamStrategy = getExamStrategy;
//# sourceMappingURL=examStrategy.factory.js.map