"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuestionSelectorService = void 0;
const AppError_1 = __importDefault(require("../../../error/AppError"));
const question_model_1 = require("../../Questions/question.model");
const mongoose_1 = require("mongoose");
const selectQuestions = async (options) => {
    const filter = {};
    if (options.topicIds?.length) {
        filter.topicId = {
            $in: options.topicIds.map((id) => new mongoose_1.Types.ObjectId(id)),
        };
    }
    if (options.subjectId) {
        filter.subjectId = options.subjectId;
    }
    if (options.chapterId) {
        filter.chapterId = options.chapterId;
    }
    if (options.source) {
        filter["examInfo.category"] = options.source;
    }
    if (options.year) {
        filter["examInfo.year"] = options.year;
    }
    if (options.tags?.length) {
        filter.tags = {
            $in: options.tags,
        };
    }
    console.log("Filter:", filter);
    const total = await question_model_1.Question.countDocuments(filter);
    console.log("Matching questions:", total);
    const questions = await question_model_1.Question.aggregate([
        {
            $match: filter,
        },
        {
            $sample: {
                size: options.count,
            },
        },
    ]);
    if (!questions.length) {
        throw new AppError_1.default(404, "No questions found for this exam.");
    }
    return questions;
};
exports.QuestionSelectorService = {
    selectQuestions,
};
//# sourceMappingURL=questionSelector.service.js.map