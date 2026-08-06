"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Result = void 0;
const mongoose_1 = require("mongoose");
const resultSchema = new mongoose_1.Schema({
    sessionId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "ExamSession",
        required: true,
        unique: true,
    },
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    totalQuestions: {
        type: Number,
        required: true,
    },
    attempted: {
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
    score: {
        type: Number,
        required: true,
    },
    accuracy: {
        type: Number,
        required: true,
    },
    negativeMark: {
        type: Number,
        required: true,
    },
}, {
    timestamps: true,
});
exports.Result = (0, mongoose_1.model)("Result", resultSchema);
//# sourceMappingURL=result.model.js.map