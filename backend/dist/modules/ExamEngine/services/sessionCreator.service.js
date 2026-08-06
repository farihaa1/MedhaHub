"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SessionCreatorService = void 0;
const mongoose_1 = require("mongoose");
const examSession_model_1 = require("../../examSession/examSession.model");
const examSession_constant_1 = require("../../examSession/examSession.constant");
const createSession = async (payload) => {
    const questions = payload.questions.map((questionId, index) => ({
        questionId,
        order: index + 1,
    }));
    console.log(questions);
    return await examSession_model_1.ExamSession.create({
        userId: new mongoose_1.Types.ObjectId(payload.userId),
        examType: payload.examType,
        questions,
        settings: {
            shuffleQuestions: payload.settings?.shuffleQuestions ?? false,
            shuffleOptions: payload.settings?.shuffleOptions ?? false,
        },
        duration: payload.duration,
        totalMarks: payload.totalMarks,
        negativeMark: payload.negativeMark,
        status: examSession_constant_1.ExamSessionStatus.RUNNING,
        startTime: new Date(),
    });
};
exports.SessionCreatorService = {
    createSession,
};
//# sourceMappingURL=sessionCreator.service.js.map