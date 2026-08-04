/* ============================================================
 * Category
 * ========================================================== */

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
 * ========================================================== */

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
 * ========================================================== */

export const QuestionBankVisibility = {
  PUBLIC: "PUBLIC",
  PRIVATE: "PRIVATE",
} as const

export type TQuestionBankVisibility =
  (typeof QuestionBankVisibility)[keyof typeof QuestionBankVisibility]

/* ============================================================
 * Status
 * ========================================================== */

export const QuestionBankStatus = {
  REVIEW: "REVIEW",
  PUBLISHED: "PUBLISHED",
  REJECTED: "REJECTED",
  ARCHIVED: "ARCHIVED",
} as const

export type TQuestionBankStatus =
  (typeof QuestionBankStatus)[keyof typeof QuestionBankStatus]

/* ============================================================
 * Base
 * ========================================================== */

export interface IUserRef {
  _id: string
  name: string
  email: string
}

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
 * Payload
 * ========================================================== */

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
 * Filters
 * ========================================================== */

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
 * Table
 * ========================================================== */

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
 * Question Bank Item
 * ========================================================== */

export type TQuestionBankItemStatus = "PENDING" | "APPROVED" | "REJECTED"

export interface IQuestionBankItem {
  _id: string

  questionBank: string

  question: string

  order: number

  marks: number

  negativeMarks: number

  isActive: boolean

  status: TQuestionBankItemStatus

  reviewRemark?: string

  createdAt: string

  updatedAt: string
}

/* ============================================================
 * Question inside Bank
 * ========================================================== */

export interface IQuestionBankQuestion {
  _id: string

  questionBank: string

  order: number

  marks: number

  negativeMarks: number

  isActive: boolean

  status: TQuestionBankItemStatus

  question: {
    _id: string

    questionText: string

    difficulty: string

    type: string

    status: string

    subjectId: {
      _id: string
      title: string
    }

    chapterId: {
      _id: string
      title: string
    }

    topicId: {
      _id: string
      title: string
    }
  }
}

/* ============================================================
 * Payloads
 * ========================================================== */

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
 * ========================================================== */

export interface IApiResponse<T> {
  success: boolean
  message: string
  data: T
}

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
