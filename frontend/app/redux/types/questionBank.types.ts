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

  createdAt: string

  updatedAt: string
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
