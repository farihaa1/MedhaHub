"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DuplicateDetectorController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const duplicateDetector_service_1 = __importDefault(require("./duplicateDetector.service"));
/**
 * POST
 *
 * Run duplicate scan.
 *
 * Example:
 *
 * POST /api/v1/duplicate-detector/scan
 *
 * {
 *   "scope": "questionBank",
 *   "questionBankId": "..."
 * }
 */
const scan = async (req, res) => {
    const result = await duplicateDetector_service_1.default.scanScope(req.body);
    res.status(http_status_1.default.OK).json({
        success: true,
        message: "Duplicate detection scan completed successfully.",
        data: result,
    });
};
/**
 * Check one question for duplicates.
 *
 * POST
 * /api/v1/duplicate-detector/question/:questionId
 */
const checkQuestion = async (req, res) => {
    const questionId = String(req.params.questionId);
    const result = await duplicateDetector_service_1.default.indexQuestion(questionId);
    res.status(http_status_1.default.OK).json({
        success: true,
        message: "Question duplicate check completed successfully.",
        data: result,
    });
};
/**
 * Get duplicate pairs.
 *
 * GET
 * /api/v1/duplicate-detector/pairs
 */
const getPairs = async (req, res) => {
    const result = await duplicateDetector_service_1.default.getPairs({
        status: typeof req.query.status === "string"
            ? req.query.status
            : undefined,
        scope: typeof req.query.scope === "string"
            ? req.query.scope
            : undefined,
        scopeId: typeof req.query.scopeId === "string" ? req.query.scopeId : undefined,
        minSimilarity: typeof req.query.minSimilarity === "string"
            ? Number(req.query.minSimilarity)
            : undefined,
        page: typeof req.query.page === "string" ? Number(req.query.page) : undefined,
        limit: typeof req.query.limit === "string" ? Number(req.query.limit) : undefined,
    });
    res.status(http_status_1.default.OK).json({
        success: true,
        message: "Duplicate pairs retrieved successfully.",
        data: result.data,
        meta: result.meta,
    });
};
/**
 * Statistics.
 *
 * GET
 * /api/v1/duplicate-detector/stats
 */
const getStats = async (_req, res) => {
    const result = await duplicateDetector_service_1.default.getStats();
    res.status(http_status_1.default.OK).json({
        success: true,
        message: "Duplicate detector statistics retrieved successfully.",
        data: result,
    });
};
/**
 * Review duplicate pair.
 *
 * PATCH
 * /api/v1/duplicate-detector/:id/review
 */
const review = async (req, res) => {
    const result = await duplicateDetector_service_1.default.review(String(req.params.id), req.body.status, req.user?._id);
    res.status(http_status_1.default.OK).json({
        success: true,
        message: "Duplicate review updated successfully.",
        data: result,
    });
};
/**
 * Resolve duplicate.
 *
 * PATCH
 * /api/v1/duplicate-detector/:id/resolve
 */
const resolve = async (req, res) => {
    const result = await duplicateDetector_service_1.default.resolve(String(req.params.id), req.body.keepQuestionId, req.body.archiveQuestionId, req.user?._id);
    res.status(http_status_1.default.OK).json({
        success: true,
        message: "Duplicate resolved successfully.",
        data: result,
    });
};
exports.DuplicateDetectorController = {
    scan,
    checkQuestion,
    getPairs,
    getStats,
    review,
    resolve,
};
//# sourceMappingURL=duplicateDetector.controller.js.map