
import type { IApiResponse } from "@/app/features/auth/auth.type";


// ============================================================
// ENUMS
// ============================================================

export enum DuplicateScope {
  GLOBAL = "global",
  SUBJECT = "subject",
  CHAPTER = "chapter",
  TOPIC = "topic",
  QUESTION_BANK = "questionBank",
  MODEL_TEST = "modelTest",
}

export enum DuplicateStatus {
  PENDING = "pending",
  DUPLICATE = "duplicate",
  NOT_DUPLICATE = "not_duplicate",
  IGNORED = "ignored",
}


// ============================================================
// QUESTION
// ============================================================

export interface IDuplicateQuestion {
  _id: string;

  questionText: string;

  options?: string[];

  answer?: string;

  explanation?: string;

  subjectId?: string;

  chapterId?: string;

  topicId?: string;

  questionBankId?: string;

  modelTestId?: string;
}


// ============================================================
// DUPLICATE PAIR
// ============================================================

export interface IDuplicatePair {
  _id: string;

  questionA: IDuplicateQuestion;

  questionB: IDuplicateQuestion;

  similarity: number;

  exactMatch: boolean;

  status: DuplicateStatus;

  scope: DuplicateScope;

  scopeId?: string;

  reviewedAt?: string;

  reviewedBy?: string;

  resolution?: {
    keptQuestionId: string;

    archivedQuestionId: string;
  };

  createdAt: string;

  updatedAt: string;
}


// ============================================================
// STATS
// ============================================================

export interface IDuplicateStats {
  total: number;

  pending: number;

  duplicate: number;

  notDuplicate: number;

  ignored: number;

  exact: number;
}


// ============================================================
// PAGINATION
// ============================================================

export interface IDuplicatePagination {
  page: number;

  limit: number;

  total: number;

  totalPages: number;
}


// ============================================================
// GET PAIRS QUERY
// ============================================================

export interface IDuplicatePairsQuery {
  status?: DuplicateStatus;

  scope?: DuplicateScope;

  scopeId?: string;

  minSimilarity?: number;

  page?: number;

  limit?: number;
}


// ============================================================
// GET PAIRS RESPONSE
// ============================================================

export interface IDuplicatePairsResponse {
  success: boolean;

  message: string;

  data: IDuplicatePair[];

  meta: IDuplicatePagination;
}


// ============================================================
// SCAN REQUEST
// ============================================================

export interface IDuplicateScanRequest {
  scope: DuplicateScope;

  subjectId?: string;

  chapterId?: string;

  topicId?: string;

  questionBankId?: string;

  modelTestId?: string;

  compareQuestionBankIds?: string[];

  compareModelTestIds?: string[];

  minSimilarity?: number;
}


// ============================================================
// JOB RESPONSE
// ============================================================

export interface IDuplicateJobResponse {
  success: boolean;

  message: string;

  data: {
    jobId: string;
  };
}


// ============================================================
// REVIEW
// ============================================================

export interface IReviewDuplicateRequest {
  status: DuplicateStatus;
}


// ============================================================
// RESOLVE
// ============================================================

export interface IResolveDuplicateRequest {
  keepQuestionId: string;

  archiveQuestionId: string;
}


// ============================================================
// API RESPONSE HELPERS
// ============================================================

export type DuplicateStatsResponse =
  IApiResponse<IDuplicateStats>;
