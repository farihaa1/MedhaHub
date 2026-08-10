import type { ExamOptionLabel } from "./exam.type"

// ============================================================
// RESULT OPTION
// ============================================================

export interface ResultReviewOption {
  label: ExamOptionLabel
  text: string
  image?: string | null
  isCorrect: boolean
}

// ============================================================
// RESULT QUESTION
// ============================================================

export interface ResultReviewQuestion {
  id: string

  order: number

  questionText: string

  questionImage?: string | null

  options: ResultReviewOption[]

  selectedOption?: ExamOptionLabel

  correctOption?: ExamOptionLabel

  isCorrect: boolean

  explanation?: string

  explanationImage?: string | null
}

// ============================================================
// RESULT STATISTICS
// ============================================================

export interface ResultData {
  totalQuestions: number
  attempted: number
  correct: number
  wrong: number
  skipped: number

  score: number
  accuracy: number
  negativeMark: number
}

// ============================================================
// RESULT RESPONSE
// ============================================================

export interface ResultReviewResponse {
  success: boolean
  statusCode: number
  message: string

  data: {
    result: ResultData
    questions: ResultReviewQuestion[]
  }
}
