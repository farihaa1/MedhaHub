"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnswerService = void 0;
const question_model_1 = require("../../Questions/question.model");
const AppError_1 = __importDefault(require("../../../error/AppError"));
const http_status_1 = __importDefault(require("http-status"));
const saveAnswer = async (session, payload) => {
    const question = await question_model_1.Question.findById(payload.questionId);
    if (!question) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Question not found");
    }
    const optionIndex = {
        A: 0,
        B: 1,
        C: 2,
        D: 3,
    }[payload.selectedOption];
    const selectedOption = question.options[optionIndex];
    const isCorrect = selectedOption?.isCorrect ?? false;
    const existingAnswer = session.answers.find((a) => a.questionId.toString() === payload.questionId);
    if (existingAnswer) {
        existingAnswer.selectedOption = payload.selectedOption;
        existingAnswer.isCorrect = isCorrect;
        existingAnswer.timeTaken = payload.timeTaken ?? 0;
    }
    else {
        session.answers.push({
            questionId: question._id,
            selectedOption: payload.selectedOption,
            isCorrect,
            timeTaken: payload.timeTaken ?? 0,
        });
    }
    await session.save();
    return {
        success: true,
    };
};
exports.AnswerService = {
    saveAnswer,
};
//# sourceMappingURL=answer.service.js.map