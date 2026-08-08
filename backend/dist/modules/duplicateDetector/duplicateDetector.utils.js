"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeQuestionText = normalizeQuestionText;
exports.createQuestionHash = createQuestionHash;
exports.createNGrams = createNGrams;
exports.cosineSimilarity = cosineSimilarity;
exports.calculateQuestionSimilarity = calculateQuestionSimilarity;
exports.createSignatures = createSignatures;
exports.sortQuestionIds = sortQuestionIds;
const crypto_1 = __importDefault(require("crypto"));
function normalizeQuestionText(text) {
    if (!text) {
        return "";
    }
    return text
        .normalize("NFKC")
        .toLowerCase()
        .replace(/[।!?.,:;()[\]{}"'`~\-_/\\|]/g, " ")
        .replace(/\s+/g, " ")
        .trim();
}
function createQuestionHash(text) {
    const normalized = normalizeQuestionText(text);
    return crypto_1.default.createHash("sha256").update(normalized, "utf8").digest("hex");
}
function createNGrams(text, n = 3) {
    const normalized = normalizeQuestionText(text);
    const grams = new Map();
    if (!normalized) {
        return grams;
    }
    if (normalized.length < n) {
        grams.set(normalized, 1);
        return grams;
    }
    for (let i = 0; i <= normalized.length - n; i++) {
        const gram = normalized.slice(i, i + n);
        grams.set(gram, (grams.get(gram) ?? 0) + 1);
    }
    return grams;
}
function cosineSimilarity(a, b) {
    const keys = new Set([...a.keys(), ...b.keys()]);
    let dot = 0;
    let magnitudeA = 0;
    let magnitudeB = 0;
    for (const key of keys) {
        const valueA = a.get(key) ?? 0;
        const valueB = b.get(key) ?? 0;
        dot += valueA * valueB;
        magnitudeA += valueA * valueA;
        magnitudeB += valueB * valueB;
    }
    if (magnitudeA === 0 || magnitudeB === 0) {
        return 0;
    }
    return dot / (Math.sqrt(magnitudeA) * Math.sqrt(magnitudeB));
}
function calculateQuestionSimilarity(textA, textB) {
    const normalizedA = normalizeQuestionText(textA);
    const normalizedB = normalizeQuestionText(textB);
    if (!normalizedA || !normalizedB) {
        return 0;
    }
    if (normalizedA === normalizedB) {
        return 1;
    }
    return cosineSimilarity(createNGrams(normalizedA), createNGrams(normalizedB));
}
function createSignatures(text) {
    const normalized = normalizeQuestionText(text);
    const n = 3;
    const signatures = new Set();
    if (!normalized) {
        return [];
    }
    if (normalized.length < n) {
        return [normalized];
    }
    for (let i = 0; i <= normalized.length - n; i++) {
        signatures.add(normalized.slice(i, i + n));
    }
    /*
     * Don't store thousands of signatures
     * for a long question.
     */
    return Array.from(signatures).sort().slice(0, 30);
}
function sortQuestionIds(idA, idB) {
    const a = idA.toString();
    const b = idB.toString();
    if (a < b) {
        return {
            questionA: idA,
            questionB: idB,
        };
    }
    return {
        questionA: idB,
        questionB: idA,
    };
}
//# sourceMappingURL=duplicateDetector.utils.js.map