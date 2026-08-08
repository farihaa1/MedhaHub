"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getQuestionById = getQuestionById;
exports.getQuestionsForScope = getQuestionsForScope;
exports.getQuestionsFromBanks = getQuestionsFromBanks;
exports.getQuestionsFromModelTests = getQuestionsFromModelTests;
const mongoose_1 = require("mongoose");
const question_model_1 = require("../Questions/question.model");
const duplicateDetector_constants_1 = require("./duplicateDetector.constants");
// ============================================================
// COMMON SELECT
// ============================================================
const DUPLICATE_QUESTION_SELECT = [
    "_id",
    "questionText",
    "exactHash",
    "normalizedText",
    "subjectId",
    "chapterId",
    "topicId",
    "questionBankIds",
    "modelTestIds",
].join(" ");
// ============================================================
// GET ONE QUESTION
// ============================================================
async function getQuestionById(questionId) {
    if (!mongoose_1.Types.ObjectId.isValid(questionId)) {
        return null;
    }
    return question_model_1.Question.findById(questionId)
        .select(DUPLICATE_QUESTION_SELECT)
        .lean();
}
// ============================================================
// BUILD SCOPE FILTER
// ============================================================
function buildQuestionFilter(scope) {
    const filter = {};
    switch (scope.scope) {
        // --------------------------------------------------------
        // SUBJECT
        // --------------------------------------------------------
        case duplicateDetector_constants_1.DuplicateScope.SUBJECT: {
            if (scope.subjectId && mongoose_1.Types.ObjectId.isValid(scope.subjectId)) {
                filter.subjectId = new mongoose_1.Types.ObjectId(scope.subjectId);
            }
            break;
        }
        // --------------------------------------------------------
        // CHAPTER
        // --------------------------------------------------------
        case duplicateDetector_constants_1.DuplicateScope.CHAPTER: {
            if (scope.chapterId && mongoose_1.Types.ObjectId.isValid(scope.chapterId)) {
                filter.chapterId = new mongoose_1.Types.ObjectId(scope.chapterId);
            }
            break;
        }
        // --------------------------------------------------------
        // TOPIC
        // --------------------------------------------------------
        case duplicateDetector_constants_1.DuplicateScope.TOPIC: {
            if (scope.topicId && mongoose_1.Types.ObjectId.isValid(scope.topicId)) {
                filter.topicId = new mongoose_1.Types.ObjectId(scope.topicId);
            }
            break;
        }
        // --------------------------------------------------------
        // ONE QUESTION BANK
        // --------------------------------------------------------
        case duplicateDetector_constants_1.DuplicateScope.QUESTION_BANK: {
            if (scope.questionBankId &&
                mongoose_1.Types.ObjectId.isValid(scope.questionBankId)) {
                filter.questionBankIds = new mongoose_1.Types.ObjectId(scope.questionBankId);
            }
            break;
        }
        // --------------------------------------------------------
        // ONE MODEL TEST
        // --------------------------------------------------------
        case duplicateDetector_constants_1.DuplicateScope.MODEL_TEST: {
            if (scope.modelTestId && mongoose_1.Types.ObjectId.isValid(scope.modelTestId)) {
                filter.modelTestIds = new mongoose_1.Types.ObjectId(scope.modelTestId);
            }
            break;
        }
        // --------------------------------------------------------
        // GLOBAL
        // --------------------------------------------------------
        case duplicateDetector_constants_1.DuplicateScope.GLOBAL:
        default:
            break;
    }
    return filter;
}
// ============================================================
// GET QUESTIONS FOR NORMAL SCOPE
// ============================================================
async function getQuestionsForScope(scope) {
    const filter = buildQuestionFilter(scope);
    return question_model_1.Question.find(filter)
        .select(DUPLICATE_QUESTION_SELECT)
        .lean();
}
// ============================================================
// GET QUESTIONS FROM QUESTION BANKS
//
// Supports:
// - one bank
// - multiple banks
//
// Example:
//
// compareQuestionBankIds:
// [
//   "bankA",
//   "bankB"
// ]
//
// This means:
// "Find duplicates between these banks."
// ============================================================
async function getQuestionsFromBanks(questionBankIds) {
    const validIds = questionBankIds
        .filter((id) => mongoose_1.Types.ObjectId.isValid(id))
        .map((id) => new mongoose_1.Types.ObjectId(id));
    if (!validIds.length) {
        return [];
    }
    return question_model_1.Question.find({
        questionBankIds: {
            $in: validIds,
        },
    })
        .select(DUPLICATE_QUESTION_SELECT)
        .lean();
}
// ============================================================
// GET QUESTIONS FROM MODEL TESTS
//
// Supports:
// - one model test
// - multiple model tests
// ============================================================
async function getQuestionsFromModelTests(modelTestIds) {
    const validIds = modelTestIds
        .filter((id) => mongoose_1.Types.ObjectId.isValid(id))
        .map((id) => new mongoose_1.Types.ObjectId(id));
    if (!validIds.length) {
        return [];
    }
    return question_model_1.Question.find({
        modelTestIds: {
            $in: validIds,
        },
    })
        .select(DUPLICATE_QUESTION_SELECT)
        .lean();
}
//# sourceMappingURL=duplicateDetector.adapter.js.map