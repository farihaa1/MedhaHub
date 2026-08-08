"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DuplicatePair = void 0;
const mongoose_1 = require("mongoose");
const duplicateDetector_constants_1 = require("./duplicateDetector.constants");
const duplicatePairSchema = new mongoose_1.Schema({
    questionA: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Question",
        required: true,
    },
    questionB: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Question",
        required: true,
    },
    similarity: {
        type: Number,
        required: true,
        min: 0,
        max: 1,
    },
    exactMatch: {
        type: Boolean,
        default: false,
    },
    scope: {
        type: String,
        enum: Object.values(duplicateDetector_constants_1.DuplicateScope),
        required: true,
    },
    scopeId: {
        type: mongoose_1.Schema.Types.ObjectId,
    },
    status: {
        type: String,
        enum: Object.values(duplicateDetector_constants_1.DuplicateStatus),
        default: duplicateDetector_constants_1.DuplicateStatus.PENDING,
    },
    detectedAt: {
        type: Date,
        default: Date.now,
    },
    reviewedAt: Date,
    reviewedBy: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
    },
    resolution: {
        keptQuestionId: {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: "Question",
        },
        archivedQuestionId: {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: "Question",
        },
    },
}, {
    timestamps: true,
});
/*
 * Important:
 * questionA/questionB are already sorted
 * before saving.
 */
duplicatePairSchema.index({
    questionA: 1,
    questionB: 1,
    scope: 1,
    scopeId: 1,
}, {
    unique: true,
});
duplicatePairSchema.index({
    status: 1,
    similarity: -1,
});
duplicatePairSchema.index({
    scope: 1,
    scopeId: 1,
    similarity: -1,
});
exports.DuplicatePair = (0, mongoose_1.model)("DuplicatePair", duplicatePairSchema);
//# sourceMappingURL=duplicateDetector.model.js.map