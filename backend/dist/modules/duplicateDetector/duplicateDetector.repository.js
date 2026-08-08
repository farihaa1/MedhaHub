"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveDuplicatePair = saveDuplicatePair;
exports.getDuplicatePair = getDuplicatePair;
const duplicateDetector_model_1 = require("./duplicateDetector.model");
const duplicateDetector_constants_1 = require("./duplicateDetector.constants");
const duplicateDetector_utils_1 = require("./duplicateDetector.utils");
async function saveDuplicatePair(questionA, questionB, similarity, exactMatch, scope, scopeId) {
    const sorted = (0, duplicateDetector_utils_1.sortQuestionIds)(questionA, questionB);
    return duplicateDetector_model_1.DuplicatePair.findOneAndUpdate({
        questionA: sorted.questionA,
        questionB: sorted.questionB,
        scope,
        scopeId: scopeId ?? null,
    }, {
        $set: {
            similarity,
            exactMatch,
            detectedAt: new Date(),
        },
        $setOnInsert: {
            status: duplicateDetector_constants_1.DuplicateStatus.PENDING,
        },
    }, {
        upsert: true,
        new: true,
    });
}
async function getDuplicatePair(id) {
    return duplicateDetector_model_1.DuplicatePair.findById(id)
        .populate("questionA")
        .populate("questionB")
        .lean();
}
//# sourceMappingURL=duplicateDetector.repository.js.map