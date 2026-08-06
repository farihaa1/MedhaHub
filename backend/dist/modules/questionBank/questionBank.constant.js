"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QUESTION_BANK_SEARCHABLE_FIELDS = exports.QUESTION_BANK_VISIBILITY = exports.QUESTION_BANK_PAPER = exports.QUESTION_BANK_CATEGORY = exports.QuestionBankVisibility = exports.QuestionBankPaper = exports.QuestionBankCategory = void 0;
exports.QuestionBankCategory = {
    BCS: "BCS",
    PRIMARY: "PRIMARY",
    NTRCA: "NTRCA",
    BANK: "BANK",
    UNIVERSITY: "UNIVERSITY",
    MEDICAL: "MEDICAL",
    CUSTOM: "CUSTOM",
};
exports.QuestionBankPaper = {
    PRELIMINARY: "PRELIMINARY",
    WRITTEN: "WRITTEN",
    VIVA: "VIVA",
};
exports.QuestionBankVisibility = {
    PUBLIC: "PUBLIC",
    PRIVATE: "PRIVATE",
};
exports.QUESTION_BANK_CATEGORY = Object.values(exports.QuestionBankCategory);
exports.QUESTION_BANK_PAPER = Object.values(exports.QuestionBankPaper);
exports.QUESTION_BANK_VISIBILITY = Object.values(exports.QuestionBankVisibility);
exports.QUESTION_BANK_SEARCHABLE_FIELDS = [
    "title",
    "organization",
    "description",
];
//# sourceMappingURL=questionBank.constant.js.map