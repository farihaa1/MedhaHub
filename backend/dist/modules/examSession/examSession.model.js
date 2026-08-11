"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExamSession = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const examSession_constant_1 = require("./examSession.constant");
// ============================================================
// QUESTION SCHEMA
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
// ANSWER SCHEMA
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
    },
    correctOption: {
        type: String,
        enum: ["A", "B", "C", "D"],
    },
    isCorrect: {
        type: Boolean,
    },
    timeTaken: {
        type: Number,
    },
}, {
    _id: false,
});
// ============================================================
// RESULT SCHEMA
// ============================================================
const examSessionResultSchema = new mongoose_1.Schema({
    score: {
        type: Number,
        required: true,
    },
    correct: {
        type: Number,
        required: true,
    },
    wrong: {
        type: Number,
        required: true,
    },
    skipped: {
        type: Number,
        required: true,
    },
    accuracy: {
        type: Number,
        required: true,
    },
}, {
    _id: false,
});
// ============================================================
// EXAM SESSION SCHEMA
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
        required: true,
    },
    questions: {
        type: [examSessionQuestionSchema],
        required: true,
    },
    duration: {
        type: Number,
        required: true,
    },
    totalMarks: {
        type: Number,
        required: true,
    },
    negativeMark: {
        type: Number,
        default: 0,
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
    // ========================================================
    // STATUS
    // ========================================================
    status: {
        type: String,
        enum: Object.values(examSession_constant_1.ExamSessionStatus),
        default: examSession_constant_1.ExamSessionStatus.RUNNING,
        required: true,
        index: true,
    },
    // ========================================================
    // TIME
    // ========================================================
    startTime: {
        type: Date,
        required: true,
    },
    submittedAt: {
        type: Date,
    },
    endTime: {
        type: Date,
    },
    // ========================================================
    // RESULT
    // ========================================================
    result: {
        type: examSessionResultSchema,
    },
}, {
    timestamps: true,
});
// ============================================================
// MODEL
// ============================================================
exports.ExamSession = mongoose_1.default.model("ExamSession", examSessionSchema);
//# sourceMappingURL=examSession.model.js.map