"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapExamSession = void 0;
const OPTION_LABELS = ["A", "B", "C", "D"];
const mapExamSession = (data) => {
    const session = data.session ?? data;
    const questions = data.questions ?? session.questions ?? [];
    return {
        _id: session._id.toString(),
        examType: session.examType,
        status: session.status,
        duration: session.duration,
        totalMarks: session.totalMarks,
        negativeMark: session.negativeMark,
        startTime: session.startTime,
        endTime: session.endTime,
        settings: session.settings,
        answers: (session.answers ?? []).map((answer) => ({
            questionId: answer.questionId.toString(),
            selectedOption: answer.selectedOption,
            isCorrect: answer.isCorrect,
            timeTaken: answer.timeTaken,
        })),
        questions: questions.map((item, index) => {
            const question = item.questionId && typeof item.questionId === "object"
                ? item.questionId
                : item;
            const questionId = item.questionId?._id ?? item.questionId ?? question._id;
            return {
                questionId: questionId.toString(),
                order: item.order ?? index + 1,
                questionText: question.questionText,
                questionImage: question.questionImage ?? null,
                options: (question.options ?? []).map((option, optionIndex) => ({
                    _id: option._id?.toString(),
                    label: OPTION_LABELS[optionIndex],
                    text: option.text,
                    image: option.image ?? null,
                })),
            };
        }),
    };
};
exports.mapExamSession = mapExamSession;
//# sourceMappingURL=examSession.mapper.js.map