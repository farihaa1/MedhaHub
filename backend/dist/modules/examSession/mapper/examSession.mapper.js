"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapExamSession = void 0;
// ============================================================
// MAP SESSION
// ============================================================
const mapExamSession = (session) => {
    return {
        _id: session._id.toString(),
        userId: session.userId.toString(),
        examType: session.examType,
        duration: session.duration,
        totalMarks: session.totalMarks,
        negativeMark: session.negativeMark,
        startTime: session.startTime,
        submittedAt: session.submittedAt,
        endTime: session.endTime,
        settings: session.settings,
        answers: session.answers.map((answer) => ({
            questionId: answer.questionId.toString(),
            selectedOption: answer.selectedOption,
            correctOption: answer.correctOption,
            isCorrect: answer.isCorrect,
            timeTaken: answer.timeTaken,
        })),
        questions: session.questions
            .map((item) => {
            const question = item.questionId;
            if (!question || typeof question !== "object") {
                return null;
            }
            return {
                _id: question._id.toString(),
                order: item.order,
                questionText: question.questionText,
                image: question.questionImage ?? question.image ?? null,
                options: question.options ?? [],
                explanation: question.explanation ?? null,
            };
        })
            .filter(Boolean),
    };
};
exports.mapExamSession = mapExamSession;
//# sourceMappingURL=examSession.mapper.js.map