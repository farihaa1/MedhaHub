"use strict";
// modules/examSession/examSession.model.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExamSession = void 0;
const mongoose_1 = require("mongoose");
const examSession_constant_1 = require("./examSession.constant");
const examEngine_constant_1 = require("../ExamEngine/examEngine.constant");
// ============================================================
// SESSION QUESTION
// ============================================================
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
}, {
    _id: false,
});
// ============================================================
// ANSWER
// ============================================================
const examAnswerSchema = new mongoose_1.Schema({
    questionId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Question",
        required: true,
    },
    selectedOption: {
        type: String,
        enum: ["A", "B", "C", "D"],
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
}, {
    _id: false,
});
// ============================================================
// SESSION
// ============================================================
const examSessionSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
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
    questions: {
        type: [examSessionQuestionSchema],
        default: [],
    },
    answers: {
        type: [examAnswerSchema],
        default: [],
    },
    settings: {
        shuffleQuestions: {
            type: Boolean,
            default: false,
        },
        shuffleOptions: {
            type: Boolean,
            default: false,
        },
    },
    /**
     * Duration in minutes.
     */
    duration: {
        type: Number,
        required: true,
        min: 1,
    },
    totalMarks: {
        type: Number,
        required: true,
        min: 0,
    },
    negativeMark: {
        type: Number,
        required: true,
        min: 0,
    },
    status: {
        type: String,
        enum: Object.values(examSession_constant_1.ExamSessionStatus),
        default: examSession_constant_1.ExamSessionStatus.RUNNING,
        index: true,
    },
    startTime: {
        type: Date,
        required: true,
    },
    endTime: {
        type: Date,
    },
    submittedAt: {
        type: Date,
    },
    // ========================================================
    // PERSISTED RESULT
    // ========================================================
    result: {
        score: {
            type: Number,
        },
        correct: {
            type: Number,
        },
        wrong: {
            type: Number,
        },
        skipped: {
            type: Number,
        },
        accuracy: {
            type: Number,
        },
    },
}, {
    timestamps: true,
});
// ============================================================
// INDEXES
// ============================================================
examSessionSchema.index({
    userId: 1,
    status: 1,
});
examSessionSchema.index({
    userId: 1,
    createdAt: -1,
});
exports.ExamSession = (0, mongoose_1.model)("ExamSession", examSessionSchema);
//# sourceMappingURL=examSession.model.js.map