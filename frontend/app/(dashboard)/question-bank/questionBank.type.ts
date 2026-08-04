export interface TQuestionBank {
  title: string

  slug: string

  category: "BCS" | "PRIMARY" | "NTRCA" | "BANK" | "UNIVERSITY" | "CUSTOM"

  year?: number

  paper?: "PRELI" | "WRITTEN"

  organization?: string

  description?: string

  isPublished: boolean

  totalQuestions: number

//   createdBy: Types.ObjectId
}
