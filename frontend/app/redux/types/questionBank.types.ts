/* ============================================================
 * Category
 * ============================================================ */

export const QuestionBanksCategory = {
  BCS: "bcs",
  NTRCA: "ntrca",
  PSC_NON_CADRE: "psc-non-cadre",
  BANK: "bank",
  GOVERNMENT: "government",
  DEFENCE: "defence",
  HEALTH: "health",
  ADMISSION: "admission",
  TEACHER: "teacher",
  OTHERS: "others",
} as const

export type TQuestionBankCategory =
  (typeof QuestionBanksCategory)[keyof typeof QuestionBanksCategory]

/* ============================================================
 * Paper
 * ============================================================ */

export const QuestionBankPaper = {
  PRELIMINARY: "PRELIMINARY",
  WRITTEN: "WRITTEN",
  VIVA: "VIVA",
  MODEL_TEST: "MODEL_TEST",
  PRACTICE: "PRACTICE",
} as const

export type TQuestionBankPaper =
  (typeof QuestionBankPaper)[keyof typeof QuestionBankPaper]

/* ============================================================
 * Visibility
 * ============================================================ */

export const QuestionBankVisibility = {
  PUBLIC: "PUBLIC",
  PRIVATE: "PRIVATE",
} as const

export type TQuestionBankVisibility =
  (typeof QuestionBankVisibility)[keyof typeof QuestionBankVisibility]

/* ============================================================
 * Status
 * ============================================================ */

export const QuestionBankStatus = {
  REVIEW: "REVIEW",
  PUBLISHED: "PUBLISHED",
  REJECTED: "REJECTED",
  ARCHIVED: "ARCHIVED",
} as const

export type TQuestionBankStatus =
  (typeof QuestionBankStatus)[keyof typeof QuestionBankStatus]

/* ============================================================
 * User Reference
 * ============================================================ */

export interface IUserRef {
  _id: string
  name: string
  email: string
}

/* ============================================================
 * Question Bank
 * ============================================================ */

export interface IQuestionBank {
  _id: string
  title: string
  slug: string

  category: TQuestionBankCategory

  organization?: string

  year?: number

  paper?: TQuestionBankPaper

  description?: string

  visibility: TQuestionBankVisibility

  status: TQuestionBankStatus

  totalQuestions: number

  isPublished: boolean

  isPremium: boolean

  createdBy?: IUserRef

  updatedBy?: IUserRef

  createdAt: string

  updatedAt: string
}

/* ============================================================
 * Question Bank Payload
 * ============================================================ */

export interface IQuestionBankPayload {
  title: string

  category: TQuestionBankCategory

  organization?: string

  year?: number

  paper?: TQuestionBankPaper

  description?: string

  visibility?: TQuestionBankVisibility

  isPublished?: boolean

  isPremium?: boolean
}

export type IQuestionBankForm = IQuestionBankPayload & {
  visibility: TQuestionBankVisibility
  isPublished: boolean
  isPremium: boolean
}

/* ============================================================
 * Question Bank Filters
 * ============================================================ */

export interface IQuestionBankFilters {
  page?: number
  limit?: number

  searchTerm?: string

  category?: TQuestionBankCategory

  paper?: TQuestionBankPaper

  visibility?: TQuestionBankVisibility

  status?: TQuestionBankStatus

  year?: number

  isPublished?: boolean

  isPremium?: boolean

  sortBy?: string

  sortOrder?: "asc" | "desc"
}

/* ============================================================
 * Question Bank Table
 * ============================================================ */

export type IQuestionBankTable = Pick<
  IQuestionBank,
  | "_id"
  | "title"
  | "category"
  | "year"
  | "paper"
  | "status"
  | "visibility"
  | "totalQuestions"
  | "isPublished"
  | "isPremium"
>

/* ============================================================
 * Question Bank Item Status
 * ============================================================ */

export type TQuestionBankItemStatus = "PENDING" | "APPROVED" | "REJECTED"

/* ============================================================
 * Populated Question
 *
 * This is the question returned when the backend populates
 * the question reference.
 * ============================================================ */

export interface IQuestionBankPopulatedQuestion {
  _id: string

  questionText: string

  difficulty: string

  type: string

  status: string

  subjectId?: {
    _id: string
    title: string
  }

  chapterId?: {
    _id: string
    title: string
  }

  topicId?: {
    _id: string
    title: string
  }
}

/* ============================================================
 * Question Bank Item
 *
 * This is the item returned by:
 *
 * GET /question-bank-items/:questionBankId/questions
 *
 * The question is populated.
 * ============================================================ */

export interface IQuestionBankItem {
  _id: string

  questionBank: string

  order: number

  marks: number

  negativeMarks: number

  isActive: boolean

  status: TQuestionBankItemStatus

  reviewRemark?: string

  createdAt: string

  updatedAt: string

  question: IQuestionBankPopulatedQuestion
}

/* ============================================================
 * Alias
 *
 * Keep this if other existing components already import
 * IQuestionBankQuestion.
 * ============================================================ */

export type IQuestionBankQuestion = IQuestionBankItem

/* ============================================================
 * Payloads
 * ============================================================ */

export interface IAddQuestionToBankPayload {
  question: string

  order?: number

  marks?: number

  negativeMarks?: number
}

export interface IBulkAddQuestionsPayload {
  questionIds: string[]
}

export interface IReorderQuestion {
  id: string

  order: number
}

/* ============================================================
 * API Response
 * ============================================================ */

export interface IApiResponse<T> {
  success: boolean
  message: string
  data: T
}

/* ============================================================
 * Pagination
 * ============================================================ */

export interface IPaginationMeta {
  page: number
  limit: number
  total: number
  totalPage: number
}

export interface IPaginatedResponse<T> {
  meta: IPaginationMeta
  data: T[]
}
