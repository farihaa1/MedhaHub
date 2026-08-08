import { Request, Response } from "express";
import httpStatus from "http-status";

import DuplicateDetectorService from "./duplicateDetector.service";

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
const scan = async (req: Request, res: Response) => {
  const result = await DuplicateDetectorService.scanScope(req.body);

  res.status(httpStatus.OK).json({
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
const checkQuestion = async (req: Request, res: Response) => {
  const questionId = String(req.params.questionId);

  const result = await DuplicateDetectorService.indexQuestion(questionId);

  res.status(httpStatus.OK).json({
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
const getPairs = async (req: Request, res: Response) => {
  const result = await DuplicateDetectorService.getPairs({
    status:
      typeof req.query.status === "string"
        ? (req.query.status as any)
        : undefined,

    scope:
      typeof req.query.scope === "string"
        ? (req.query.scope as any)
        : undefined,

    scopeId:
      typeof req.query.scopeId === "string" ? req.query.scopeId : undefined,

    minSimilarity:
      typeof req.query.minSimilarity === "string"
        ? Number(req.query.minSimilarity)
        : undefined,

    page:
      typeof req.query.page === "string" ? Number(req.query.page) : undefined,

    limit:
      typeof req.query.limit === "string" ? Number(req.query.limit) : undefined,
  });

  res.status(httpStatus.OK).json({
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
const getStats = async (_req: Request, res: Response) => {
  const result = await DuplicateDetectorService.getStats();

  res.status(httpStatus.OK).json({
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
const review = async (req: Request, res: Response) => {
  const result = await DuplicateDetectorService.review(
    String(req.params.id),

    req.body.status,

    req.user?._id,
  );

  res.status(httpStatus.OK).json({
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
const resolve = async (req: Request, res: Response) => {
  const result = await DuplicateDetectorService.resolve(
    String(req.params.id),

    req.body.keepQuestionId,

    req.body.archiveQuestionId,

    req.user?._id,
  );

  res.status(httpStatus.OK).json({
    success: true,

    message: "Duplicate resolved successfully.",

    data: result,
  });
};

export const DuplicateDetectorController = {
  scan,

  checkQuestion,

  getPairs,

  getStats,

  review,

  resolve,
};
