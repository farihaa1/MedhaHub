"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapExamSession = void 0;
const examSession_constant_1 = require("../examSession.constant");
const examSession_utils_1 = require("../examSession.utils");
const mapExamSession = (session) => {
    return {
        id: session.id,
        status: session.status,
        duration: session.duration,
        remainingTime: (0, examSession_utils_1.calculateRemainingTime)(session.startTime, session.duration),
        questions: session.questions.map((q) => ({
            order: q.order,
            question: {
                id: q.questionId._id.toString(),
                questionText: q.questionId.questionText,
                options: q.questionId.options.map((option, index) => ({
                    _id: option._id.toString(),
                    label: ["A", "B", "C", "D"][index],
                    text: option.text,
                    image: option.image ?? null,
                    isCorrect: session.status === examSession_constant_1.ExamSessionStatus.SUBMITTED
                        ? option.isCorrect
                        : false,
                })),
                explanation: session.status === examSession_constant_1.ExamSessionStatus.SUBMITTED
                    ? q.questionId.explanation
                    : undefined,
            },
        })),
    };
};
exports.mapExamSession = mapExamSession;
//# sourceMappingURL=examSession.mapper.js.map