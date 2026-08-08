"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const question_model_1 = require("../Questions/question.model");
const duplicateDetector_model_1 = require("./duplicateDetector.model");
const duplicateDetector_constants_1 = require("./duplicateDetector.constants");
const duplicateDetector_adapter_1 = require("./duplicateDetector.adapter");
const duplicateDetector_utils_1 = require("./duplicateDetector.utils");
const questionFingerprint_model_1 = require("./questionFingerprint.model");
const duplicateDetector_repository_1 = require("./duplicateDetector.repository");
const DuplicateDetectorService = {
    // ============================================================
    // CHECK ONE QUESTION
    // ============================================================
    async indexQuestion(questionId) {
        const question = await getQuestionForDetection(questionId);
        if (!question) {
            throw new Error("Question not found");
        }
        const text = typeof question.questionText === "string"
            ? question.questionText.trim()
            : "";
        if (!text) {
            throw new Error("Question text is empty");
        }
        const hash = (0, duplicateDetector_utils_1.createQuestionHash)(text);
        const signatures = (0, duplicateDetector_utils_1.createSignatures)(text);
        // ----------------------------------------------------------
        // Save / update fingerprint
        // ----------------------------------------------------------
        await questionFingerprint_model_1.QuestionFingerprint.findOneAndUpdate({
            questionId: question._id,
        }, {
            $set: {
                questionId: question._id,
                hash,
                signatures,
            },
        }, {
            upsert: true,
            new: true,
        });
        // ----------------------------------------------------------
        // Find possible duplicates
        // ----------------------------------------------------------
        const detection = await this.detectForNewQuestion(questionId);
        return {
            questionId,
            hash,
            signatures,
            detection,
        };
    },
    // ============================================================
    // INCREMENTAL DUPLICATE DETECTION
    //
    // Used when checking one newly-created question.
    // ============================================================
    async detectForNewQuestion(questionId) {
        const question = await getQuestionForDetection(questionId);
        if (!question) {
            throw new Error("Question not found");
        }
        const text = typeof question.questionText === "string"
            ? question.questionText.trim()
            : "";
        if (!text) {
            return {
                candidates: 0,
                duplicates: 0,
            };
        }
        const signatures = (0, duplicateDetector_utils_1.createSignatures)(text);
        // ----------------------------------------------------------
        // Find candidate fingerprints
        //
        // IMPORTANT:
        // We do NOT compare against every question.
        // ----------------------------------------------------------
        const fingerprints = await questionFingerprint_model_1.QuestionFingerprint.find({
            signatures: {
                $in: signatures,
            },
            questionId: {
                $ne: question._id,
            },
        })
            .select("questionId")
            .limit(duplicateDetector_constants_1.DUPLICATE_CONFIG.MAX_CANDIDATES)
            .lean();
        if (!fingerprints.length) {
            return {
                candidates: 0,
                duplicates: 0,
            };
        }
        // ----------------------------------------------------------
        // Convert candidate IDs
        // ----------------------------------------------------------
        const candidateIds = fingerprints
            .map((item) => item.questionId)
            .filter(Boolean)
            .map((id) => id instanceof mongoose_1.Types.ObjectId ? id : new mongoose_1.Types.ObjectId(id));
        if (!candidateIds.length) {
            return {
                candidates: 0,
                duplicates: 0,
            };
        }
        // ----------------------------------------------------------
        // Get candidate questions
        // ----------------------------------------------------------
        const candidates = await getQuestionsByIds(candidateIds);
        let duplicates = 0;
        // ----------------------------------------------------------
        // Calculate actual similarity
        // ----------------------------------------------------------
        for (const candidate of candidates) {
            if (!candidate.questionText) {
                continue;
            }
            const similarity = (0, duplicateDetector_utils_1.calculateQuestionSimilarity)(text, candidate.questionText);
            if (similarity < duplicateDetector_constants_1.DUPLICATE_CONFIG.DEFAULT_THRESHOLD) {
                continue;
            }
            // --------------------------------------------------------
            // Avoid A -> B and B -> A duplicates
            // --------------------------------------------------------
            const [questionA, questionB] = sortQuestionIds(question._id, candidate._id);
            await (0, duplicateDetector_repository_1.saveDuplicatePair)(questionA, questionB, similarity, similarity === 1, duplicateDetector_constants_1.DuplicateScope.GLOBAL);
            duplicates++;
        }
        return {
            candidates: candidates.length,
            duplicates,
        };
    },
    // ============================================================
    // SCAN SCOPE
    //
    // Supported:
    //
    // GLOBAL
    // SUBJECT
    // CHAPTER
    // TOPIC
    // QUESTION_BANK
    // MODEL_TEST
    //
    // ============================================================
    async scanScope(scope) {
        let questions;
        // ----------------------------------------------------------
        // Question Bank
        // ----------------------------------------------------------
        if (scope.scope === duplicateDetector_constants_1.DuplicateScope.QUESTION_BANK &&
            scope.compareQuestionBankIds?.length) {
            questions = await (0, duplicateDetector_adapter_1.getQuestionsFromBanks)(scope.compareQuestionBankIds);
        }
        // ----------------------------------------------------------
        // Model Test
        // ----------------------------------------------------------
        else if (scope.scope === duplicateDetector_constants_1.DuplicateScope.MODEL_TEST &&
            scope.compareModelTestIds?.length) {
            questions = await (0, duplicateDetector_adapter_1.getQuestionsFromModelTests)(scope.compareModelTestIds);
        }
        // ----------------------------------------------------------
        // Other scopes
        // ----------------------------------------------------------
        else {
            questions = await (0, duplicateDetector_adapter_1.getQuestionsForScope)(scope);
        }
        // ==========================================================
        // No questions
        // ==========================================================
        if (!questions.length) {
            return {
                totalQuestions: 0,
                exactDuplicates: 0,
                similarDuplicates: 0,
                message: "No questions found for this scope.",
            };
        }
        let exactDuplicates = 0;
        let similarDuplicates = 0;
        // ==========================================================
        // STEP 1
        //
        // Create/update fingerprints
        // ==========================================================
        for (const question of questions) {
            const text = typeof question.questionText === "string"
                ? question.questionText.trim()
                : "";
            if (!text) {
                continue;
            }
            const hash = (0, duplicateDetector_utils_1.createQuestionHash)(text);
            const signatures = (0, duplicateDetector_utils_1.createSignatures)(text);
            await questionFingerprint_model_1.QuestionFingerprint.updateOne({
                questionId: question._id,
            }, {
                $set: {
                    questionId: question._id,
                    hash,
                    signatures,
                },
            }, {
                upsert: true,
            });
        }
        // ==========================================================
        // STEP 2
        //
        // Find candidate duplicates
        // ==========================================================
        for (const question of questions) {
            const text = typeof question.questionText === "string"
                ? question.questionText.trim()
                : "";
            if (!text) {
                continue;
            }
            const signatures = (0, duplicateDetector_utils_1.createSignatures)(text);
            const fingerprints = await questionFingerprint_model_1.QuestionFingerprint.find({
                signatures: {
                    $in: signatures,
                },
                questionId: {
                    $ne: question._id,
                },
            })
                .select("questionId")
                .limit(duplicateDetector_constants_1.DUPLICATE_CONFIG.MAX_CANDIDATES)
                .lean();
            if (!fingerprints.length) {
                continue;
            }
            // --------------------------------------------------------
            // Convert candidate IDs
            // --------------------------------------------------------
            const candidateIds = fingerprints
                .map((item) => item.questionId)
                .filter(Boolean)
                .map((id) => id instanceof mongoose_1.Types.ObjectId ? id : new mongoose_1.Types.ObjectId(id));
            if (!candidateIds.length) {
                continue;
            }
            const candidates = await getQuestionsByIds(candidateIds);
            // ========================================================
            // Compare candidates
            // ========================================================
            for (const candidate of candidates) {
                if (!candidate.questionText) {
                    continue;
                }
                // ------------------------------------------------------
                // Prevent self comparison
                // ------------------------------------------------------
                if (candidate._id.equals(question._id)) {
                    continue;
                }
                // ------------------------------------------------------
                // Prevent A -> B and B -> A
                //
                // Only process the pair once.
                // ------------------------------------------------------
                if (question._id.toString() > candidate._id.toString()) {
                    continue;
                }
                const similarity = (0, duplicateDetector_utils_1.calculateQuestionSimilarity)(text, candidate.questionText);
                // ------------------------------------------------------
                // Ignore weak matches
                // ------------------------------------------------------
                if (similarity < duplicateDetector_constants_1.DUPLICATE_CONFIG.DEFAULT_THRESHOLD) {
                    continue;
                }
                // ------------------------------------------------------
                // Save duplicate pair
                // ------------------------------------------------------
                const saved = await (0, duplicateDetector_repository_1.saveDuplicatePair)(question._id, candidate._id, similarity, similarity === 1, scope.scope, getScopeId(scope));
                if (saved?.exactMatch) {
                    exactDuplicates++;
                }
                else {
                    similarDuplicates++;
                }
            }
        }
        // ==========================================================
        // RESULT
        // ==========================================================
        return {
            totalQuestions: questions.length,
            exactDuplicates,
            similarDuplicates,
            totalDuplicates: exactDuplicates + similarDuplicates,
        };
    },
    // ============================================================
    // GET DUPLICATE PAIRS
    // ============================================================
    async getPairs(options) {
        const page = options.page ?? duplicateDetector_constants_1.DUPLICATE_CONFIG.DEFAULT_PAGE;
        const limit = Math.min(options.limit ?? duplicateDetector_constants_1.DUPLICATE_CONFIG.DEFAULT_LIMIT, duplicateDetector_constants_1.DUPLICATE_CONFIG.MAX_LIMIT);
        const minSimilarity = options.minSimilarity ?? duplicateDetector_constants_1.DUPLICATE_CONFIG.DEFAULT_THRESHOLD;
        const filter = {
            similarity: {
                $gte: minSimilarity,
            },
        };
        // ----------------------------------------------------------
        // Status filter
        // ----------------------------------------------------------
        if (options.status) {
            filter.status = options.status;
        }
        // ----------------------------------------------------------
        // Scope filter
        // ----------------------------------------------------------
        if (options.scope) {
            filter.scope = options.scope;
        }
        // ----------------------------------------------------------
        // Scope ID filter
        // ----------------------------------------------------------
        if (options.scopeId && mongoose_1.Types.ObjectId.isValid(options.scopeId)) {
            filter.scopeId = new mongoose_1.Types.ObjectId(options.scopeId);
        }
        const skip = (page - 1) * limit;
        const [data, total] = await Promise.all([
            duplicateDetector_model_1.DuplicatePair.find(filter)
                .populate({
                path: "questionA",
                select: "questionText options answer explanation subjectId chapterId topicId",
            })
                .populate({
                path: "questionB",
                select: "questionText options answer explanation subjectId chapterId topicId",
            })
                .sort({
                similarity: -1,
            })
                .skip(skip)
                .limit(limit)
                .lean(),
            duplicateDetector_model_1.DuplicatePair.countDocuments(filter),
        ]);
        return {
            data,
            meta: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    },
    // ============================================================
    // STATISTICS
    // ============================================================
    async getStats() {
        const [total, pending, duplicate, notDuplicate, ignored, exact] = await Promise.all([
            duplicateDetector_model_1.DuplicatePair.countDocuments(),
            duplicateDetector_model_1.DuplicatePair.countDocuments({
                status: duplicateDetector_constants_1.DuplicateStatus.PENDING,
            }),
            duplicateDetector_model_1.DuplicatePair.countDocuments({
                status: duplicateDetector_constants_1.DuplicateStatus.DUPLICATE,
            }),
            duplicateDetector_model_1.DuplicatePair.countDocuments({
                status: duplicateDetector_constants_1.DuplicateStatus.NOT_DUPLICATE,
            }),
            duplicateDetector_model_1.DuplicatePair.countDocuments({
                status: duplicateDetector_constants_1.DuplicateStatus.IGNORED,
            }),
            duplicateDetector_model_1.DuplicatePair.countDocuments({
                exactMatch: true,
            }),
        ]);
        return {
            total,
            pending,
            duplicate,
            notDuplicate,
            ignored,
            exact,
        };
    },
    // ============================================================
    // REVIEW
    // ============================================================
    async review(id, status, reviewedBy) {
        const update = {
            status,
            reviewedAt: new Date(),
        };
        if (reviewedBy && mongoose_1.Types.ObjectId.isValid(reviewedBy)) {
            update.reviewedBy = new mongoose_1.Types.ObjectId(reviewedBy);
        }
        const pair = await duplicateDetector_model_1.DuplicatePair.findByIdAndUpdate(id, {
            $set: update,
        }, {
            new: true,
        });
        if (!pair) {
            throw new Error("Duplicate pair not found");
        }
        return pair;
    },
    // ============================================================
    // RESOLVE DUPLICATE
    // ============================================================
    async resolve(id, keepQuestionId, archiveQuestionId, reviewedBy) {
        const pair = await duplicateDetector_model_1.DuplicatePair.findById(id);
        if (!pair) {
            throw new Error("Duplicate pair not found");
        }
        // ----------------------------------------------------------
        // Validate keep question
        // ----------------------------------------------------------
        const questionA = pair.questionA.toString();
        const questionB = pair.questionB.toString();
        if (questionA !== keepQuestionId && questionB !== keepQuestionId) {
            throw new Error("Keep question does not belong to this duplicate pair");
        }
        // ----------------------------------------------------------
        // Validate archive question
        // ----------------------------------------------------------
        if (questionA !== archiveQuestionId && questionB !== archiveQuestionId) {
            throw new Error("Archive question does not belong to this duplicate pair");
        }
        // ----------------------------------------------------------
        // Prevent keeping and archiving
        // the same question
        // ----------------------------------------------------------
        if (keepQuestionId === archiveQuestionId) {
            throw new Error("Keep and archive questions cannot be the same");
        }
        const update = {
            status: duplicateDetector_constants_1.DuplicateStatus.DUPLICATE,
            reviewedAt: new Date(),
            resolution: {
                keptQuestionId: new mongoose_1.Types.ObjectId(keepQuestionId),
                archivedQuestionId: new mongoose_1.Types.ObjectId(archiveQuestionId),
            },
        };
        if (reviewedBy && mongoose_1.Types.ObjectId.isValid(reviewedBy)) {
            update.reviewedBy = new mongoose_1.Types.ObjectId(reviewedBy);
        }
        await duplicateDetector_model_1.DuplicatePair.findByIdAndUpdate(id, {
            $set: update,
        });
        // ----------------------------------------------------------
        // IMPORTANT
        //
        // We DO NOT delete the question.
        //
        // You should connect this to your
        // existing question archive/status
        // system later.
        // ----------------------------------------------------------
        return {
            success: true,
            keepQuestionId,
            archiveQuestionId,
        };
    },
};
// ============================================================
// HELPERS
// ============================================================
async function getQuestionForDetection(questionId) {
    if (!mongoose_1.Types.ObjectId.isValid(questionId)) {
        return null;
    }
    return question_model_1.Question.findById(questionId).select("_id questionText").lean();
}
async function getQuestionsByIds(ids) {
    if (!ids.length) {
        return [];
    }
    return question_model_1.Question.find({
        _id: {
            $in: ids,
        },
    })
        .select("_id questionText")
        .lean();
}
/**
 * Always return IDs in the same order.
 *
 * This prevents:
 *
 * A -> B
 *
 * and
 *
 * B -> A
 *
 * from being treated as two different
 * duplicate pairs.
 */
function sortQuestionIds(a, b) {
    if (a.toString() < b.toString()) {
        return [a, b];
    }
    return [b, a];
}
function getScopeId(scope) {
    const id = scope.questionBankId ??
        scope.modelTestId ??
        scope.topicId ??
        scope.chapterId ??
        scope.subjectId;
    if (!id || !mongoose_1.Types.ObjectId.isValid(id)) {
        return undefined;
    }
    return new mongoose_1.Types.ObjectId(id);
}
exports.default = DuplicateDetectorService;
//# sourceMappingURL=duplicateDetector.service.js.map