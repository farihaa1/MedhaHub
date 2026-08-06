"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultSort = exports.getPagination = exports.calculateTotalPages = exports.normalizeSearchTerm = exports.generateQuestionBankTitle = exports.generateQuestionBankSlug = void 0;
const slugify_1 = __importDefault(require("slugify"));
/**
 * Generate a clean slug from title
 */
const generateQuestionBankSlug = (title) => {
    return (0, slugify_1.default)(title, {
        lower: true,
        strict: true,
        trim: true,
    });
};
exports.generateQuestionBankSlug = generateQuestionBankSlug;
/**
 * Build title automatically
 */
const generateQuestionBankTitle = (category, year, paper) => {
    let title = "";
    if (year) {
        title += `${year}`;
    }
    title += ` ${category}`;
    if (paper) {
        title += ` ${paper}`;
    }
    return title.trim();
};
exports.generateQuestionBankTitle = generateQuestionBankTitle;
/**
 * Normalize search keyword
 */
const normalizeSearchTerm = (keyword) => {
    if (!keyword)
        return "";
    return keyword.trim().toLowerCase();
};
exports.normalizeSearchTerm = normalizeSearchTerm;
/**
 * Calculate total pages
 */
const calculateTotalPages = (total, limit) => {
    return Math.ceil(total / limit);
};
exports.calculateTotalPages = calculateTotalPages;
/**
 * Mongo pagination helper
 */
const getPagination = (page = 1, limit = 10) => {
    const currentPage = Number(page);
    const perPage = Number(limit);
    const skip = (currentPage - 1) * perPage;
    return {
        page: currentPage,
        limit: perPage,
        skip,
    };
};
exports.getPagination = getPagination;
/**
 * Default sorting
 */
exports.defaultSort = {
    year: -1,
    createdAt: -1,
};
//# sourceMappingURL=questionBank.utils.js.map