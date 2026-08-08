import { Types } from "mongoose";

import { Question } from "../Questions/question.model";

import { DuplicateScope } from "./duplicateDetector.constants";

import {
  IDetectionScope,
  IQuestionForDuplicateDetection,
} from "./duplicateDetector.interface";

// ============================================================
// COMMON SELECT
// ============================================================

const DUPLICATE_QUESTION_SELECT = [
  "_id",
  "questionText",
  "exactHash",
  "normalizedText",
  "subjectId",
  "chapterId",
  "topicId",
  "questionBankIds",
  "modelTestIds",
].join(" ");

// ============================================================
// GET ONE QUESTION
// ============================================================

export async function getQuestionById(
  questionId: string,
): Promise<IQuestionForDuplicateDetection | null> {
  if (!Types.ObjectId.isValid(questionId)) {
    return null;
  }

  return Question.findById(questionId)
    .select(DUPLICATE_QUESTION_SELECT)
    .lean() as unknown as Promise<IQuestionForDuplicateDetection | null>;
}

// ============================================================
// BUILD SCOPE FILTER
// ============================================================

function buildQuestionFilter(scope: IDetectionScope): Record<string, unknown> {
  const filter: Record<string, unknown> = {};

  switch (scope.scope) {
    // --------------------------------------------------------
    // SUBJECT
    // --------------------------------------------------------

    case DuplicateScope.SUBJECT: {
      if (scope.subjectId && Types.ObjectId.isValid(scope.subjectId)) {
        filter.subjectId = new Types.ObjectId(scope.subjectId);
      }

      break;
    }

    // --------------------------------------------------------
    // CHAPTER
    // --------------------------------------------------------

    case DuplicateScope.CHAPTER: {
      if (scope.chapterId && Types.ObjectId.isValid(scope.chapterId)) {
        filter.chapterId = new Types.ObjectId(scope.chapterId);
      }

      break;
    }

    // --------------------------------------------------------
    // TOPIC
    // --------------------------------------------------------

    case DuplicateScope.TOPIC: {
      if (scope.topicId && Types.ObjectId.isValid(scope.topicId)) {
        filter.topicId = new Types.ObjectId(scope.topicId);
      }

      break;
    }

    // --------------------------------------------------------
    // ONE QUESTION BANK
    // --------------------------------------------------------

    case DuplicateScope.QUESTION_BANK: {
      if (
        scope.questionBankId &&
        Types.ObjectId.isValid(scope.questionBankId)
      ) {
        filter.questionBankIds = new Types.ObjectId(scope.questionBankId);
      }

      break;
    }

    // --------------------------------------------------------
    // ONE MODEL TEST
    // --------------------------------------------------------

    case DuplicateScope.MODEL_TEST: {
      if (scope.modelTestId && Types.ObjectId.isValid(scope.modelTestId)) {
        filter.modelTestIds = new Types.ObjectId(scope.modelTestId);
      }

      break;
    }

    // --------------------------------------------------------
    // GLOBAL
    // --------------------------------------------------------

    case DuplicateScope.GLOBAL:

    default:
      break;
  }

  return filter;
}

// ============================================================
// GET QUESTIONS FOR NORMAL SCOPE
// ============================================================

export async function getQuestionsForScope(
  scope: IDetectionScope,
): Promise<IQuestionForDuplicateDetection[]> {
  const filter = buildQuestionFilter(scope);

  return Question.find(filter)
    .select(DUPLICATE_QUESTION_SELECT)
    .lean() as unknown as Promise<IQuestionForDuplicateDetection[]>;
}

// ============================================================
// GET QUESTIONS FROM QUESTION BANKS
//
// Supports:
// - one bank
// - multiple banks
//
// Example:
//
// compareQuestionBankIds:
// [
//   "bankA",
//   "bankB"
// ]
//
// This means:
// "Find duplicates between these banks."
// ============================================================

export async function getQuestionsFromBanks(
  questionBankIds: string[],
): Promise<IQuestionForDuplicateDetection[]> {
  const validIds = questionBankIds
    .filter((id) => Types.ObjectId.isValid(id))
    .map((id) => new Types.ObjectId(id));

  if (!validIds.length) {
    return [];
  }

  return Question.find({
    questionBankIds: {
      $in: validIds,
    },
  })
    .select(DUPLICATE_QUESTION_SELECT)
    .lean() as unknown as Promise<IQuestionForDuplicateDetection[]>;
}

// ============================================================
// GET QUESTIONS FROM MODEL TESTS
//
// Supports:
// - one model test
// - multiple model tests
// ============================================================

export async function getQuestionsFromModelTests(
  modelTestIds: string[],
): Promise<IQuestionForDuplicateDetection[]> {
  const validIds = modelTestIds
    .filter((id) => Types.ObjectId.isValid(id))
    .map((id) => new Types.ObjectId(id));

  if (!validIds.length) {
    return [];
  }

  return Question.find({
    modelTestIds: {
      $in: validIds,
    },
  })
    .select(DUPLICATE_QUESTION_SELECT)
    .lean() as unknown as Promise<IQuestionForDuplicateDetection[]>;
}
