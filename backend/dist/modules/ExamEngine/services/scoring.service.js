"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScoringService = void 0;
const calculateScore = ({ correct, wrong, skipped, total, negativeMark, }) => {
    const score = correct - wrong * negativeMark;
    const accuracy = total === 0 ? 0 : Number(((correct / total) * 100).toFixed(2));
    const percentage = total === 0 ? 0 : Number(((score / total) * 100).toFixed(2));
    return {
        score,
        percentage,
        accuracy,
        correct,
        wrong,
        skipped,
    };
};
exports.ScoringService = {
    calculateScore,
};
//# sourceMappingURL=scoring.service.js.map