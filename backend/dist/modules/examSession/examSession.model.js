"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExamSession = void 0;
const mongoose_1 = require("mongoose");
const examSession_constant_1 = require("./examSession.constant");
const examEngine_constant_1 = require("../ExamEngine/examEngine.constant");
const examSessionQuestionSchema = new mongoose_1.Schema({
    questionId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Question",
        required: true,
    },
    order: {
        type: Number,
        required: true,
    },
}, { _id: false });
const examAnswerSchema = new mongoose_1.Schema({
    questionId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Question",
        required: true,
    },
    selectedOption: {
        type: String,
        required: true,
    },
    isCorrect: {
        type: Boolean,
        default: false,
    },
    timeTaken: {
        type: Number,
        default: 0,
    },
}, { _id: false });
const examSessionSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    examType: {
        type: String,
        enum: Object.values(examEngine_constant_1.ExamType),
        required: true,
    },
    source: {
        type: {
            type: String,
        },
        id: {
            type: mongoose_1.Schema.Types.ObjectId,
        },
    },
    questions: [examSessionQuestionSchema],
    answers: [examAnswerSchema],
    settings: {
        shuffleQuestions: Boolean,
        shuffleOptions: Boolean,
    },
    duration: Number,
    totalMarks: Number,
    negativeMark: Number,
    status: {
        type: String,
        enum: Object.values(examSession_constant_1.ExamSessionStatus),
        default: examSession_constant_1.ExamSessionStatus.RUNNING,
    },
    startTime: Date,
    endTime: Date,
    submittedAt: Date,
    // ===============================
    // Persisted Result
    // ===============================
    result: {
        score: Number,
        correct: Number,
        wrong: Number,
        skipped: Number,
        accuracy: Number,
    },
}, {
    timestamps: true,
});
exports.ExamSession = (0, mongoose_1.model)("ExamSession", examSessionSchema);
//# sourceMappingURL=examSession.model.js.map