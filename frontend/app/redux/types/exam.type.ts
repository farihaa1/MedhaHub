export interface ExamOption {
  _id: string

  label: "A" | "B" | "C" | "D"

  text: string

  image: string | null

  isCorrect?: boolean
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

  status: "running" | "submitted" | "expired" | "cancelled"

  questions: SessionQuestion[]
}

export interface ExamSessionResponse {
  success: boolean

  message: string

  data: ExamSession
}

export interface ResultQuestion {
  id: string

  order: number

  questionText: string

  options: {
    label: "A" | "B" | "C" | "D"
    text: string
    isCorrect: boolean
  }[]

  selectedOption?: "A" | "B" | "C" | "D"

  correctOption: "A" | "B" | "C" | "D"

  isCorrect: boolean

  explanation?: string
}

export interface ExamResult {
  totalQuestions: number

  attempted: number

  correct: number

  wrong: number

  skipped: number

  score: number

  accuracy: number

  negativeMark: number
}

export interface ResultResponse {
  success: boolean

  message: string

  data: {
    result: ExamResult

    questions: ResultQuestion[]
  }
}

export interface SubmitAnswerPayload {
  sessionId: string

  questionId: string

  selectedOption: "A" | "B" | "C" | "D"

  timeTaken?: number
}
