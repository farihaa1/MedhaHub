"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeQuestion = void 0;
const normalizeQuestion = (text) => {
    return text
        .toLowerCase()
        .normalize("NFKC")
        .replace(/[^\p{L}\p{N}\s]/gu, "")
        .replace(/\s+/g, "")
        .trim();
};
exports.normalizeQuestion = normalizeQuestion;
//# sourceMappingURL=question.utils.js.map