"use strict";
// modules/examSession/services/answer.service.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnswerService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../../error/AppError"));
const question_model_1 = require("../../Questions/question.model");
const OPTION_LABELS = ["A", "B", "C", "D"];
// ============================================================
// SAVE ANSWER
// ============================================================
const saveAnswer = async (session, payload) => {
    const questionExists = session.questions.some((item) => item.questionId.toString() === payload.questionId);
    if (!questionExists) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "This question does not belong to this exam.");
    }
    const question = await question_model_1.Question.findById(payload.questionId)
        .select("options")
        .lean();
    if (!question) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Question not found.");
    }
    const selectedIndex = OPTION_LABELS.indexOf(payload.selectedOption);
    if (selectedIndex === -1) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Invalid option.");
    }
    const selectedOption = question.options[selectedIndex];
    if (!selectedOption) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Selected option does not exist.");
    }
    const isCorrect = selectedOption.isCorrect === true;
    const existingAnswerIndex = session.answers.findIndex((answer) => answer.questionId.toString() === payload.questionId);
    const answer = {
        questionId: payload.questionId,
        selectedOption: payload.selectedOption,
        isCorrect,
        timeTaken: payload.timeTaken ?? 0,
    };
    // ==========================================================
    // UPDATE EXISTING ANSWER
    // ==========================================================
    if (existingAnswerIndex !== -1) {
        session.answers[existingAnswerIndex] = answer;
    }
    else {
        session.answers.push(answer);
    }
    await session.save();
    return {
        questionId: payload.questionId,
        selectedOption: payload.selectedOption,
        isCorrect,
        timeTaken: payload.timeTaken ?? 0,
    };
};
exports.AnswerService = {
    saveAnswer,
};
//# sourceMappingURL=answer.service.js.map