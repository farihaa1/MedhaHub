import { Types } from "mongoose";

import { Question as QuestionModel } from "../Questions/question.model";

import { DuplicatePair } from "./duplicateDetector.model";

import {
  DuplicateScope,
  DuplicateStatus,
  DUPLICATE_CONFIG,
} from "./duplicateDetector.constants";

import {
  getQuestionsForScope,
  getQuestionsFromBanks,
  getQuestionsFromModelTests,
} from "./duplicateDetector.adapter";

import {
  calculateQuestionSimilarity,
  createQuestionHash,
  createSignatures,
} from "./duplicateDetector.utils";

import { QuestionFingerprint } from "./questionFingerprint.model";

import { saveDuplicatePair } from "./duplicateDetector.repository";

import { IDetectionScope } from "./duplicateDetector.interface";

const DuplicateDetectorService = {
  // ============================================================
  // CHECK ONE QUESTION
  // ============================================================

  async indexQuestion(questionId: string) {
    const question = await getQuestionForDetection(questionId);

    if (!question) {
      throw new Error("Question not found");
    }

    const text =
      typeof question.questionText === "string"
        ? question.questionText.trim()
        : "";

    if (!text) {
      throw new Error("Question text is empty");
    }

    const hash = createQuestionHash(text);

    const signatures = createSignatures(text);

    // ----------------------------------------------------------
    // Save / update fingerprint
    // ----------------------------------------------------------

    await QuestionFingerprint.findOneAndUpdate(
      {
        questionId: question._id,
      },

      {
        $set: {
          questionId: question._id,

          hash,

          signatures,
        },
      },

      {
        upsert: true,

        new: true,
      },
    );

    // ----------------------------------------------------------
    // Find possible duplicates
    // ----------------------------------------------------------

    const detection = await this.detectForNewQuestion(questionId);

    return {
      questionId,

      hash,

      signatures,

      detection,
    };
  },

  // ============================================================
  // INCREMENTAL DUPLICATE DETECTION
  //
  // Used when checking one newly-created question.
  // ============================================================

  async detectForNewQuestion(questionId: string) {
    const question = await getQuestionForDetection(questionId);

    if (!question) {
      throw new Error("Question not found");
    }

    const text =
      typeof question.questionText === "string"
        ? question.questionText.trim()
        : "";

    if (!text) {
      return {
        candidates: 0,

        duplicates: 0,
      };
    }

    const signatures = createSignatures(text);

    // ----------------------------------------------------------
    // Find candidate fingerprints
    //
    // IMPORTANT:
    // We do NOT compare against every question.
    // ----------------------------------------------------------

    const fingerprints = await QuestionFingerprint.find({
      signatures: {
        $in: signatures,
      },

      questionId: {
        $ne: question._id,
      },
    })
      .select("questionId")
      .limit(DUPLICATE_CONFIG.MAX_CANDIDATES)
      .lean();

    if (!fingerprints.length) {
      return {
        candidates: 0,

        duplicates: 0,
      };
    }

    // ----------------------------------------------------------
    // Convert candidate IDs
    // ----------------------------------------------------------

    const candidateIds = fingerprints
      .map((item) => item.questionId)
      .filter(Boolean)
      .map((id) =>
        id instanceof Types.ObjectId ? id : new Types.ObjectId(id),
      );

    if (!candidateIds.length) {
      return {
        candidates: 0,

        duplicates: 0,
      };
    }

    // ----------------------------------------------------------
    // Get candidate questions
    // ----------------------------------------------------------

    const candidates = await getQuestionsByIds(candidateIds);

    let duplicates = 0;

    // ----------------------------------------------------------
    // Calculate actual similarity
    // ----------------------------------------------------------

    for (const candidate of candidates) {
      if (!candidate.questionText) {
        continue;
      }

      const similarity = calculateQuestionSimilarity(
        text,
        candidate.questionText,
      );

      if (similarity < DUPLICATE_CONFIG.DEFAULT_THRESHOLD) {
        continue;
      }

      // --------------------------------------------------------
      // Avoid A -> B and B -> A duplicates
      // --------------------------------------------------------

      const [questionA, questionB] = sortQuestionIds(
        question._id,
        candidate._id,
      );

      await saveDuplicatePair(
        questionA,
        questionB,
        similarity,
        similarity === 1,
        DuplicateScope.GLOBAL,
      );

      duplicates++;
    }

    return {
      candidates: candidates.length,

      duplicates,
    };
  },

  // ============================================================
  // SCAN SCOPE
  //
  // Supported:
  //
  // GLOBAL
  // SUBJECT
  // CHAPTER
  // TOPIC
  // QUESTION_BANK
  // MODEL_TEST
  //
  // ============================================================

  async scanScope(scope: IDetectionScope) {
    let questions;

    // ----------------------------------------------------------
    // Question Bank
    // ----------------------------------------------------------

    if (
      scope.scope === DuplicateScope.QUESTION_BANK &&
      scope.compareQuestionBankIds?.length
    ) {
      questions = await getQuestionsFromBanks(scope.compareQuestionBankIds);
    }

    // ----------------------------------------------------------
    // Model Test
    // ----------------------------------------------------------
    else if (
      scope.scope === DuplicateScope.MODEL_TEST &&
      scope.compareModelTestIds?.length
    ) {
      questions = await getQuestionsFromModelTests(scope.compareModelTestIds);
    }

    // ----------------------------------------------------------
    // Other scopes
    // ----------------------------------------------------------
    else {
      questions = await getQuestionsForScope(scope);
    }

    // ==========================================================
    // No questions
    // ==========================================================

    if (!questions.length) {
      return {
        totalQuestions: 0,

        exactDuplicates: 0,

        similarDuplicates: 0,

        message: "No questions found for this scope.",
      };
    }

    let exactDuplicates = 0;

    let similarDuplicates = 0;

    // ==========================================================
    // STEP 1
    //
    // Create/update fingerprints
    // ==========================================================

    for (const question of questions) {
      const text =
        typeof question.questionText === "string"
          ? question.questionText.trim()
          : "";

      if (!text) {
        continue;
      }

      const hash = createQuestionHash(text);

      const signatures = createSignatures(text);

      await QuestionFingerprint.updateOne(
        {
          questionId: question._id,
        },

        {
          $set: {
            questionId: question._id,

            hash,

            signatures,
          },
        },

        {
          upsert: true,
        },
      );
    }

    // ==========================================================
    // STEP 2
    //
    // Find candidate duplicates
    // ==========================================================

    for (const question of questions) {
      const text =
        typeof question.questionText === "string"
          ? question.questionText.trim()
          : "";

      if (!text) {
        continue;
      }

      const signatures = createSignatures(text);

      const fingerprints = await QuestionFingerprint.find({
        signatures: {
          $in: signatures,
        },

        questionId: {
          $ne: question._id,
        },
      })
        .select("questionId")
        .limit(DUPLICATE_CONFIG.MAX_CANDIDATES)
        .lean();

      if (!fingerprints.length) {
        continue;
      }

      // --------------------------------------------------------
      // Convert candidate IDs
      // --------------------------------------------------------

      const candidateIds = fingerprints
        .map((item) => item.questionId)
        .filter(Boolean)
        .map((id) =>
          id instanceof Types.ObjectId ? id : new Types.ObjectId(id),
        );

      if (!candidateIds.length) {
        continue;
      }

      const candidates = await getQuestionsByIds(candidateIds);

      // ========================================================
      // Compare candidates
      // ========================================================

      for (const candidate of candidates) {
        if (!candidate.questionText) {
          continue;
        }

        // ------------------------------------------------------
        // Prevent self comparison
        // ------------------------------------------------------

        if (candidate._id.equals(question._id)) {
          continue;
        }

        // ------------------------------------------------------
        // Prevent A -> B and B -> A
        //
        // Only process the pair once.
        // ------------------------------------------------------

        if (question._id.toString() > candidate._id.toString()) {
          continue;
        }

        const similarity = calculateQuestionSimilarity(
          text,

          candidate.questionText,
        );

        // ------------------------------------------------------
        // Ignore weak matches
        // ------------------------------------------------------

        if (similarity < DUPLICATE_CONFIG.DEFAULT_THRESHOLD) {
          continue;
        }

        // ------------------------------------------------------
        // Save duplicate pair
        // ------------------------------------------------------

        const saved = await saveDuplicatePair(
          question._id,

          candidate._id,

          similarity,

          similarity === 1,

          scope.scope,

          getScopeId(scope),
        );

        if (saved?.exactMatch) {
          exactDuplicates++;
        } else {
          similarDuplicates++;
        }
      }
    }

    // ==========================================================
    // RESULT
    // ==========================================================

    return {
      totalQuestions: questions.length,

      exactDuplicates,

      similarDuplicates,

      totalDuplicates: exactDuplicates + similarDuplicates,
    };
  },

  // ============================================================
  // GET DUPLICATE PAIRS
  // ============================================================

  async getPairs(options: {
    status?: DuplicateStatus;

    scope?: DuplicateScope;

    scopeId?: string;

    minSimilarity?: number;

    page?: number;

    limit?: number;
  }) {
    const page = options.page ?? DUPLICATE_CONFIG.DEFAULT_PAGE;

    const limit = Math.min(
      options.limit ?? DUPLICATE_CONFIG.DEFAULT_LIMIT,

      DUPLICATE_CONFIG.MAX_LIMIT,
    );

    const minSimilarity =
      options.minSimilarity ?? DUPLICATE_CONFIG.DEFAULT_THRESHOLD;

    const filter: Record<string, unknown> = {
      similarity: {
        $gte: minSimilarity,
      },
    };

    // ----------------------------------------------------------
    // Status filter
    // ----------------------------------------------------------

    if (options.status) {
      filter.status = options.status;
    }

    // ----------------------------------------------------------
    // Scope filter
    // ----------------------------------------------------------

    if (options.scope) {
      filter.scope = options.scope;
    }

    // ----------------------------------------------------------
    // Scope ID filter
    // ----------------------------------------------------------

    if (options.scopeId && Types.ObjectId.isValid(options.scopeId)) {
      filter.scopeId = new Types.ObjectId(options.scopeId);
    }

    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      DuplicatePair.find(filter)
        .populate({
          path: "questionA",

          select:
            "questionText options answer explanation subjectId chapterId topicId",
        })

        .populate({
          path: "questionB",

          select:
            "questionText options answer explanation subjectId chapterId topicId",
        })

        .sort({
          similarity: -1,
        })

        .skip(skip)

        .limit(limit)

        .lean(),

      DuplicatePair.countDocuments(filter),
    ]);

    return {
      data,

      meta: {
        page,

        limit,

        total,

        totalPages: Math.ceil(total / limit),
      },
    };
  },

  // ============================================================
  // STATISTICS
  // ============================================================

  async getStats() {
    const [total, pending, duplicate, notDuplicate, ignored, exact] =
      await Promise.all([
        DuplicatePair.countDocuments(),

        DuplicatePair.countDocuments({
          status: DuplicateStatus.PENDING,
        }),

        DuplicatePair.countDocuments({
          status: DuplicateStatus.DUPLICATE,
        }),

        DuplicatePair.countDocuments({
          status: DuplicateStatus.NOT_DUPLICATE,
        }),

        DuplicatePair.countDocuments({
          status: DuplicateStatus.IGNORED,
        }),

        DuplicatePair.countDocuments({
          exactMatch: true,
        }),
      ]);

    return {
      total,

      pending,

      duplicate,

      notDuplicate,

      ignored,

      exact,
    };
  },

  // ============================================================
  // REVIEW
  // ============================================================

  async review(
    id: string,

    status: DuplicateStatus,

    reviewedBy?: string,
  ) {
    const update: Record<string, unknown> = {
      status,

      reviewedAt: new Date(),
    };

    if (reviewedBy && Types.ObjectId.isValid(reviewedBy)) {
      update.reviewedBy = new Types.ObjectId(reviewedBy);
    }

    const pair = await DuplicatePair.findByIdAndUpdate(
      id,

      {
        $set: update,
      },

      {
        new: true,
      },
    );

    if (!pair) {
      throw new Error("Duplicate pair not found");
    }

    return pair;
  },

  // ============================================================
  // RESOLVE DUPLICATE
  // ============================================================

  async resolve(
    id: string,

    keepQuestionId: string,

    archiveQuestionId: string,

    reviewedBy?: string,
  ) {
    const pair = await DuplicatePair.findById(id);

    if (!pair) {
      throw new Error("Duplicate pair not found");
    }

    // ----------------------------------------------------------
    // Validate keep question
    // ----------------------------------------------------------

    const questionA = pair.questionA.toString();

    const questionB = pair.questionB.toString();

    if (questionA !== keepQuestionId && questionB !== keepQuestionId) {
      throw new Error("Keep question does not belong to this duplicate pair");
    }

    // ----------------------------------------------------------
    // Validate archive question
    // ----------------------------------------------------------

    if (questionA !== archiveQuestionId && questionB !== archiveQuestionId) {
      throw new Error(
        "Archive question does not belong to this duplicate pair",
      );
    }

    // ----------------------------------------------------------
    // Prevent keeping and archiving
    // the same question
    // ----------------------------------------------------------

    if (keepQuestionId === archiveQuestionId) {
      throw new Error("Keep and archive questions cannot be the same");
    }

    const update: Record<string, unknown> = {
      status: DuplicateStatus.DUPLICATE,

      reviewedAt: new Date(),

      resolution: {
        keptQuestionId: new Types.ObjectId(keepQuestionId),

        archivedQuestionId: new Types.ObjectId(archiveQuestionId),
      },
    };

    if (reviewedBy && Types.ObjectId.isValid(reviewedBy)) {
      update.reviewedBy = new Types.ObjectId(reviewedBy);
    }

    await DuplicatePair.findByIdAndUpdate(
      id,

      {
        $set: update,
      },
    );

    // ----------------------------------------------------------
    // IMPORTANT
    //
    // We DO NOT delete the question.
    //
    // You should connect this to your
    // existing question archive/status
    // system later.
    // ----------------------------------------------------------

    return {
      success: true,

      keepQuestionId,

      archiveQuestionId,
    };
  },
};

// ============================================================
// HELPERS
// ============================================================

async function getQuestionForDetection(questionId: string) {
  if (!Types.ObjectId.isValid(questionId)) {
    return null;
  }

  return QuestionModel.findById(questionId).select("_id questionText").lean();
}

async function getQuestionsByIds(ids: Types.ObjectId[]) {
  if (!ids.length) {
    return [];
  }

  return QuestionModel.find({
    _id: {
      $in: ids,
    },
  })
    .select("_id questionText")
    .lean();
}

/**
 * Always return IDs in the same order.
 *
 * This prevents:
 *
 * A -> B
 *
 * and
 *
 * B -> A
 *
 * from being treated as two different
 * duplicate pairs.
 */
function sortQuestionIds(
  a: Types.ObjectId,
  b: Types.ObjectId,
): [Types.ObjectId, Types.ObjectId] {
  if (a.toString() < b.toString()) {
    return [a, b];
  }

  return [b, a];
}

function getScopeId(scope: IDetectionScope) {
  const id =
    scope.questionBankId ??
    scope.modelTestId ??
    scope.topicId ??
    scope.chapterId ??
    scope.subjectId;

  if (!id || !Types.ObjectId.isValid(id)) {
    return undefined;
  }

  return new Types.ObjectId(id);
}

export default DuplicateDetectorService;
