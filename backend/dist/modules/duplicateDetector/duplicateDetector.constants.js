"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DUPLICATE_CONFIG = exports.DuplicateScope = exports.DuplicateStatus = void 0;
var DuplicateStatus;
(function (DuplicateStatus) {
    DuplicateStatus["PENDING"] = "pending";
    DuplicateStatus["DUPLICATE"] = "duplicate";
    DuplicateStatus["NOT_DUPLICATE"] = "not_duplicate";
    DuplicateStatus["IGNORED"] = "ignored";
})(DuplicateStatus || (exports.DuplicateStatus = DuplicateStatus = {}));
var DuplicateScope;
(function (DuplicateScope) {
    DuplicateScope["GLOBAL"] = "global";
    DuplicateScope["SUBJECT"] = "subject";
    DuplicateScope["CHAPTER"] = "chapter";
    DuplicateScope["TOPIC"] = "topic";
    DuplicateScope["QUESTION_BANK"] = "question_bank";
    DuplicateScope["MODEL_TEST"] = "model_test";
})(DuplicateScope || (exports.DuplicateScope = DuplicateScope = {}));
exports.DUPLICATE_CONFIG = {
    DEFAULT_THRESHOLD: 0.7,
    HIGH_THRESHOLD: 0.9,
    VERY_HIGH_THRESHOLD: 0.95,
    NGRAM_SIZE: 3,
    MAX_CANDIDATES: 200,
    DEFAULT_PAGE: 1,
    DEFAULT_LIMIT: 20,
    MAX_LIMIT: 100,
};
//# sourceMappingURL=duplicateDetector.constants.js.map