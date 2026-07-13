export interface ExamOption {
  label: "A" | "B" | "C" | "D"
  text: string
}

export interface ExamQuestion {
  id: string
  questionText: string
  options: ExamOption[]
}

export interface SessionQuestion {
  order: number
  question: ExamQuestion
}

export interface ExamSession {
  id: string
  duration: number
  remainingTime: number
  status: string
  questions: SessionQuestion[]
}

export interface ExamSessionResponse {
  success: boolean
  message: string
  data: ExamSession
}

export interface ResultResponse {
  success: boolean
  message: string
  data: {
    totalQuestions: number
    attempted: number
    correct: number
    wrong: number
    skipped: number
    score: number
    accuracy: number
    negativeMark: number
  }
}