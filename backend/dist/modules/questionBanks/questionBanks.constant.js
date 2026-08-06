"use strict";
/* ============================================================
 * Category
 * ========================================================== */
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_QUESTION_BANKS_SORT = exports.QUESTION_BANKS_SEARCHABLE_FIELDS = exports.QUESTION_BANKS_STATUS = exports.QUESTION_BANKS_PAPER = exports.QUESTION_BANKS_CATEGORY = exports.QuestionBanksStatus = exports.QuestionBanksVisibility = exports.QuestionBanksPaper = exports.QuestionBanksCategory = void 0;
exports.QuestionBanksCategory = {
    BCS: "bcs",
    NTRCA: "ntrca",
    PSC_NON_CADRE: "psc-non-cadre",
    BANK: "bank",
    GOVERNMENT: "government",
    DEFENCE: "defence",
    HEALTH: "health",
    ADMISSION: "admission",
    TEACHER: "teacher",
    OTHERS: "others",
};
/* ============================================================
 * Paper
 * ========================================================== */
exports.QuestionBanksPaper = {
    PRELIMINARY: "PRELIMINARY",
    WRITTEN: "WRITTEN",
    VIVA: "VIVA",
    MODEL_TEST: "MODEL_TEST",
    PRACTICE: "PRACTICE",
};
/* ============================================================
 * Visibility
 * ========================================================== */
exports.QuestionBanksVisibility = {
    PUBLIC: "PUBLIC",
    PRIVATE: "PRIVATE",
};
/* ============================================================
 * Status
 * ========================================================== */
exports.QuestionBanksStatus = {
    REVIEW: "REVIEW",
    PUBLISHED: "PUBLISHED",
    REJECTED: "REJECTED",
    ARCHIVED: "ARCHIVED",
};
exports.QUESTION_BANKS_CATEGORY = Object.values(exports.QuestionBanksCategory);
exports.QUESTION_BANKS_PAPER = Object.values(exports.QuestionBanksPaper);
exports.QUESTION_BANKS_STATUS = Object.values(exports.QuestionBanksStatus);
exports.QUESTION_BANKS_SEARCHABLE_FIELDS = [
    "title",
    "organization",
    "description",
    "category"
];
exports.DEFAULT_QUESTION_BANKS_SORT = {
    year: -1,
    createdAt: -1,
};
//# sourceMappingURL=questionBanks.constant.js.map