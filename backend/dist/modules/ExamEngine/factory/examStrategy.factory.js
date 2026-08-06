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
            return new topic_strategy_1.TopicExamStrategy();
        case examEngine_constant_1.ExamType.CHAPTER:
            return new chapter_strategy_1.ChapterExamStrategy();
        case examEngine_constant_1.ExamType.SUBJECT:
            return new subject_strategy_1.SubjectExamStrategy();
        case examEngine_constant_1.ExamType.PRACTICE_SET:
            return new practiceSet_strategy_1.PracticeSetStrategy();
        case examEngine_constant_1.ExamType.MODEL_TEST:
            return new modelTest_strategy_1.ModelTestStrategy();
        case examEngine_constant_1.ExamType.PREVIOUS_YEAR:
            return new previousYear_strategy_1.PreviousYearStrategy();
        case examEngine_constant_1.ExamType.DAILY:
            return new dailyQuiz_strategy_1.DailyQuizStrategy();
        default:
            throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Unsupported exam type.");
    }
};
exports.getExamStrategy = getExamStrategy;
//# sourceMappingURL=examStrategy.factory.js.map