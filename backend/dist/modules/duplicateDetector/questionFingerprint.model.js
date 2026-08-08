"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuestionFingerprint = void 0;
const mongoose_1 = require("mongoose");
const questionFingerprintSchema = new mongoose_1.Schema({
    questionId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Question",
        required: true,
        unique: true,
        index: true,
    },
    hash: {
        type: String,
        required: true,
    },
    signatures: {
        type: [String],
        default: [],
    },
}, {
    timestamps: true,
});
questionFingerprintSchema.index({
    hash: 1,
});
questionFingerprintSchema.index({
    signatures: 1,
});
exports.QuestionFingerprint = (0, mongoose_1.model)("QuestionFingerprint", questionFingerprintSchema);
//# sourceMappingURL=questionFingerprint.model.js.map