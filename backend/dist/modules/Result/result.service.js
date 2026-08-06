"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResultService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../error/AppError"));
const examSession_model_1 = require("../examSession/examSession.model");
const result_model_1 = require("./result.model");
const scoring_service_1 = require("../ExamEngine/services/scoring.service");
const createResult = async (sessionId) => {
    const session = await examSession_model_1.ExamSession.findById(sessionId);
    console.log(session);
    if (!session) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Exam session not found");
    }
    const totalQuestions = session.questions.length;
    const correct = session.answers.filter((answer) => answer.isCorrect).length;
    const attempted = session.answers.length;
    const wrong = attempted - correct;
    const skipped = totalQuestions - attempted;
    const score = scoring_service_1.ScoringService.calculateScore({
        correct,
        wrong,
        skipped,
        total: totalQuestions,
        negativeMark: session.negativeMark,
    });
    const result = await result_model_1.Result.create({
        sessionId: session._id,
        userId: session.userId,
        totalQuestions,
        attempted,
        correct,
        wrong,
        skipped,
        score: score.score,
        accuracy: score.accuracy,
        negativeMark: session.negativeMark,
    });
    return result;
};
const getResult = async (sessionId) => {
    const session = await examSession_model_1.ExamSession.findById(sessionId).populate("questions.questionId");
    if (!session) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Session not found");
    }
    const result = await result_model_1.Result.findOne({
        sessionId,
    });
    if (!result) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Result not found");
    }
    const questions = session.questions.map((item) => {
        const question = item.questionId;
        const answer = session.answers.find((a) => a.questionId.toString() === question._id.toString());
        return {
            id: question._id,
            order: item.order,
            questionText: question.questionText,
            options: question.options.map((o, index) => ({
                label: ["A", "B", "C", "D"][index],
                text: o.text,
                isCorrect: o.isCorrect,
            })),
            selectedOption: answer?.selectedOption,
            correctOption: ["A", "B", "C", "D"][question.options.findIndex((o) => o.isCorrect)],
            isCorrect: answer?.isCorrect ?? false,
            explanation: question.explanation,
        };
    });
    return {
        result,
        questions,
    };
};
exports.ResultService = {
    createResult,
    getResult,
};
//# sourceMappingURL=result.service.js.map