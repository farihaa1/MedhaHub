"use strict";
/* ============================================================
 * Question Banks Utils
 * ========================================================== */
Object.defineProperty(exports, "__esModule", { value: true });
exports.isEmptySlug = exports.getDefaultSort = exports.calculateTotalPages = exports.getPagination = exports.generateQuestionBanksTitle = exports.normalizeSlug = exports.normalizeSearchTerm = void 0;
const questionBanks_constant_1 = require("./questionBanks.constant");
/* ============================================================
 * Normalize Search
 * ========================================================== */
const normalizeSearchTerm = (keyword) => keyword?.trim().toLowerCase() ?? "";
exports.normalizeSearchTerm = normalizeSearchTerm;
/* ============================================================
 * Normalize Slug
 * ========================================================== */
const normalizeSlug = (slug) => slug
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
exports.normalizeSlug = normalizeSlug;
const generateQuestionBanksTitle = ({ year, title, organization, paper, }) => {
    const parts = [];
    if (year) {
        parts.push(String(year));
    }
    parts.push(title);
    if (organization?.trim()) {
        parts.push(`(${organization.trim()})`);
    }
    if (paper?.trim()) {
        parts.push(paper);
    }
    return parts.join(" ");
};
exports.generateQuestionBanksTitle = generateQuestionBanksTitle;
/* ============================================================
 * Pagination
 * ========================================================== */
const getPagination = (page = 1, limit = 10) => {
    const currentPage = Math.max(1, Number(page));
    const perPage = Math.max(1, Number(limit));
    return {
        page: currentPage,
        limit: perPage,
        skip: (currentPage - 1) * perPage,
    };
};
exports.getPagination = getPagination;
/* ============================================================
 * Total Pages
 * ========================================================== */
const calculateTotalPages = (total, limit) => {
    if (limit <= 0)
        return 0;
    return Math.ceil(total / limit);
};
exports.calculateTotalPages = calculateTotalPages;
/* ============================================================
 * Default Sort
 * ========================================================== */
const getDefaultSort = () => ({
    ...questionBanks_constant_1.DEFAULT_QUESTION_BANKS_SORT,
});
exports.getDefaultSort = getDefaultSort;
/* ============================================================
 * Is Empty Slug
 * ========================================================== */
const isEmptySlug = (slug) => {
    return !slug || slug.trim().length === 0;
};
exports.isEmptySlug = isEmptySlug;
//# sourceMappingURL=questionBanks.utils.js.map