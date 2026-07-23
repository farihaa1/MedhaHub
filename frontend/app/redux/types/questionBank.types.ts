export type TQuestionBankCategory =
  "BCS" | "PRIMARY" | "NTRCA" | "BANK" | "UNIVERSITY" | "CUSTOM"

export type TQuestionBankPaper = "PRELIMINARY" | "WRITTEN" | "VIVA"

export type TQuestionBankVisibility = "PUBLIC" | "PRIVATE"
export interface IQuestionBank {
  _id: string

  title: string

  slug: string

  category: TQuestionBankCategory

  year?: number

  paper?: TQuestionBankPaper

  organization?: string

  description?: string

  visibility: TQuestionBankVisibility

  totalQuestions: number

  isPublished: boolean

  isPremium: boolean

  createdBy?: {
    _id: string
    name: string
    email: string
  }

  updatedBy?: {
    _id: string
    name: string
    email: string
  }

  createdAt: string

  updatedAt: string
}

export interface IQuestionBankPayload {
  title: string

  category: TQuestionBankCategory

  year?: number

  paper?: TQuestionBankPaper

  organization?: string

  description?: string

  visibility?: TQuestionBankVisibility

  isPublished?: boolean

  isPremium?: boolean
}

export interface IQuestionBankForm {
  title: string

  category: TQuestionBankCategory

  year?: number

  paper?: TQuestionBankPaper

  organization?: string

  description?: string

  visibility: TQuestionBankVisibility

  isPublished: boolean

  isPremium: boolean
}

export interface IQuestionBankFilters {
  page?: number

  limit?: number

  searchTerm?: string

  category?: TQuestionBankCategory

  paper?: TQuestionBankPaper

  visibility?: TQuestionBankVisibility

  year?: number

  isPublished?: boolean

  isPremium?: boolean

  sortBy?: string

  sortOrder?: "asc" | "desc"
}

export type IQuestionBankTable = Pick<
  IQuestionBank,
  | "_id"
  | "title"
  | "category"
  | "year"
  | "paper"
  | "totalQuestions"
  | "visibility"
  | "isPublished"
  | "isPremium"
>

export interface IQuestionBankItem {
  _id: string

  questionBank: string

  question: string

  order: number

  marks: number

  negativeMarks: number

  isActive: boolean

  createdAt: string

  updatedAt: string
}

export interface IQuestionBankQuestion {
  _id: string

  questionBank: string

  order: number

  marks: number

  negativeMarks: number

  isActive: boolean

  question: {
    _id: string

    question: string

    difficulty: string

    type: string

    status: string

    subject: {
      _id: string
      name: string
    }

    chapter: {
      _id: string
      name: string
    }

    topic: {
      _id: string
      name: string
    }
  }
}
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