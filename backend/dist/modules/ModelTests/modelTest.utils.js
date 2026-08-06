"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.shuffleArray = exports.isModelTestAvailable = exports.calculateTotalMarks = exports.generateSlug = void 0;
const generateSlug = (title) => {
    return title
        .trim()
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");
};
exports.generateSlug = generateSlug;
/**
 * Calculate total marks.
 * Assumes each question carries 1 mark.
 */
const calculateTotalMarks = (questionCount) => {
    return questionCount;
};
exports.calculateTotalMarks = calculateTotalMarks;
/**
 * Check if a model test is currently available.
 */
const isModelTestAvailable = (startDate, endDate) => {
    const now = new Date();
    if (startDate && now < startDate) {
        return false;
    }
    if (endDate && now > endDate) {
        return false;
    }
    return true;
};
exports.isModelTestAvailable = isModelTestAvailable;
/**
 * Shuffle an array using the Fisher-Yates algorithm.
 */
const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
};
exports.shuffleArray = shuffleArray;
//# sourceMappingURL=modelTest.utils.js.map