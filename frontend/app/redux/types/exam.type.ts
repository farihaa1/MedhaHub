// ============================================================
// EXAM OPTION LABEL
// ============================================================

export type ExamOptionLabel = "A" | "B" | "C" | "D"

// ============================================================
// EXAM TYPE
// ============================================================

export type ExamType =
  | "subject"
  | "chapter"
  | "topic"
  | "custom"
  | "practiceSet"
  | "modelTest"
  | "daily"
  | "previousYear"

// ============================================================
// EXAM STATUS
// ============================================================

export type ExamStatus = "running" | "submitted" | "expired" | "abandoned"

// ============================================================
// QUESTION OPTION
// ============================================================

export interface ExamSessionOption {
  _id?: string
  text: string
  image?: string | null
  isCorrect?: boolean
}

// ============================================================
// QUESTION
// ============================================================

export interface ExamSessionQuestion {
  _id: string
  order: number

  questionText: string

  image?: string | null

  options: ExamSessionOption[]

  explanation?: string | null
}

// ============================================================
// ANSWER
// ============================================================

export interface ExamAnswer {
  questionId: string

  selectedOption?: ExamOptionLabel

  correctOption?: ExamOptionLabel

  isCorrect?: boolean

  timeTaken?: number
}

// ============================================================
// EXAM SETTINGS
// ============================================================

export interface ExamSettings {
  shuffleQuestions?: boolean
  shuffleOptions?: boolean
}

// ============================================================
// EXAM SESSION
// ============================================================

export interface ExamSession {
  _id: string

  userId?: string

  examType: ExamType

  questions: ExamSessionQuestion[]

  currentQuestionIndex?: number

  answers?: ExamAnswer[]

  totalQuestions: number

  answeredQuestions?: number

  correctAnswers?: number

  wrongAnswers?: number

  skippedQuestions?: number

  score?: number

  duration: number

  totalMarks: number

  negativeMark: number

  startTime?: string

  submittedAt?: string

  endTime?: string

  timeRemaining?: number

  status?: ExamStatus

  settings?: ExamSettings

  createdAt?: string

  updatedAt?: string
}

// ============================================================
// START EXAM
// ============================================================

export interface StartExamPayload {
  examType: ExamType

  topicIds?: string[]

  chapterIds?: string[]

  subjectIds?: string[]

  questionIds?: string[]

  questionCount?: number
}

// ============================================================
// SUBMIT ANSWER
// ============================================================

export interface SubmitAnswerPayload {
  sessionId: string

  questionId: string

  selectedOption: ExamOptionLabel

  timeTaken?: number
}

// ============================================================
// START EXAM RESPONSE
// ============================================================

export interface StartExamResponse {
  success: boolean
  message: string
  data: ExamSession
}

// ============================================================
// GET EXAM SESSION RESPONSE
// ============================================================

export interface GetExamSessionResponse {
  success: boolean
  message: string
  data: ExamSession
}

// ============================================================
// SUBMIT ANSWER RESPONSE
// ============================================================

export interface SubmitAnswerResponse {
  success: boolean
  message: string

  data?: {
    questionId: string

    selectedOption: ExamOptionLabel

    isCorrect?: boolean

    correctOption?: ExamOptionLabel

    timeTaken?: number
  }
}

// ============================================================
// SUBMIT EXAM RESPONSE
// ============================================================

export interface SubmitExamResponse {
  success: boolean
  message: string
  data: ExamSession
}
