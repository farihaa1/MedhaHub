import { IUser } from "@/app/features/auth/auth.type"

export interface IApiResponse<T> {
  success: boolean
  statusCode: number
  message: string
  data: T
}

// ===============================
// Start Exam
// ===============================

export interface IStartExamPayload {
  examId?: string
  examType: string
  topics: string[]
  count?: number
}

// ===============================
// Question
// ===============================

export interface IQuestionOption {
  _id: string
  text: string
}

export interface IQuestion {
  _id: string
  question: string
  options: IQuestionOption[]
  marks: number
  negativeMarks?: number
}

// ===============================
// Answer
// ===============================

export interface IAnswer {
  questionId: string
  selectedOptionId: string
}

// ===============================
// Exam Session
// ===============================

export interface IExamSession {
  _id: string
  examId: string
  user: IUser | string

  status: "ONGOING" | "SUBMITTED" | "EXPIRED"

  currentQuestion: number

  questions: IQuestion[]

  answers: IAnswer[]

  startedAt: string

  expiresAt: string

  createdAt: string

  updatedAt: string
}

// ===============================
// Submit Answer
// ===============================

export interface ISubmitAnswerPayload {
  sessionId: string
  questionId: string
  selectedOptionId: string
}

// ===============================
// Submit Exam
// ===============================

export interface ISubmitExamPayload {
  sessionId: string
}

// ===============================
// Result
// ===============================

export interface IExamResult {
  sessionId: string

  totalQuestions: number

  attemptedQuestions: number

  correctAnswers: number

  wrongAnswers: number

  skippedQuestions: number

  obtainedMarks: number

  totalMarks: number

  percentage: number

  rank?: number

  submittedAt: string
}
