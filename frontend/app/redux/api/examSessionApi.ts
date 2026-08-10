import { baseApi } from "./baseApi"

// =========================================================
// TYPES
// =========================================================

export type ExamOption = "A" | "B" | "C" | "D"

export type ExamType =
  | "SUBJECT"
  | "CHAPTER"
  | "TOPIC"
  | "CUSTOM"
  | "PRACTICE_SET"
  | "MODEL_TEST"
  | "DAILY"
  | "PREVIOUS_YEAR"

// =========================================================
// START EXAM
// =========================================================

export interface StartExamPayload {
  examType: ExamType
  [key: string]: unknown
}

export interface ExamQuestion {
  _id: string
  questionText: string
  options: {
    A: string
    B: string
    C: string
    D: string
  }
  questionType?: string
  image?: string
  explanation?: string
  subjectId?: string
  chapterId?: string
  topicId?: string
}

export interface ExamSession {
  _id: string
  sessionId?: string

  userId?: string

  examType: ExamType

  questions: ExamQuestion[]

  currentQuestionIndex?: number

  answers?: ExamAnswer[]

  totalQuestions: number

  answeredQuestions?: number

  correctAnswers?: number

  wrongAnswers?: number

  skippedQuestions?: number

  score?: number

  startedAt?: string
  submittedAt?: string

  duration?: number
  timeRemaining?: number

  status?: "IN_PROGRESS" | "COMPLETED" | "EXPIRED" | "ABANDONED"

  createdAt?: string
  updatedAt?: string
}

// =========================================================
// ANSWER
// =========================================================

export interface SubmitAnswerPayload {
  sessionId: string
  questionId: string
  selectedOption: ExamOption
  timeTaken?: number
}

export interface ExamAnswer {
  questionId: string
  selectedOption?: ExamOption
  correctOption?: ExamOption
  isCorrect?: boolean
  timeTaken?: number
}

// =========================================================
// RESPONSES
// =========================================================

export interface StartExamResponse {
  success: boolean
  message: string
  data: ExamSession
}

export interface GetExamSessionResponse {
  success: boolean
  message: string
  data: ExamSession
}

export interface SubmitAnswerResponse {
  success: boolean
  message: string
  data?: {
    questionId: string
    selectedOption: ExamOption
    isCorrect?: boolean
    correctOption?: ExamOption
    timeTaken?: number
  }
}

export interface SubmitExamResponse {
  success: boolean
  message: string
  data: ExamSession
}

// =========================================================
// API
// =========================================================

export const examEngineApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // -----------------------------------------------------
    // START EXAM
    // -----------------------------------------------------
    startExam: builder.mutation<StartExamResponse, StartExamPayload>({
      query: (body) => ({
        url: "/exam-engine/start",
        method: "POST",
        body,
      }),
    }),

    // -----------------------------------------------------
    // GET EXAM SESSION
    // -----------------------------------------------------
    getExamSession: builder.query<GetExamSessionResponse, string>({
      query: (sessionId) => ({
        url: `/exam/${sessionId}`,
        method: "GET",
      }),

      providesTags: (_result, _error, sessionId) => [
        {
          type: "ExamSession",
          id: sessionId,
        },
      ],
    }),

    // -----------------------------------------------------
    // SUBMIT ANSWER
    // -----------------------------------------------------
    submitAnswer: builder.mutation<SubmitAnswerResponse, SubmitAnswerPayload>({
      query: ({ sessionId, questionId, selectedOption, timeTaken }) => ({
        url: `/exam/${sessionId}/answer`,
        method: "POST",
        body: {
          questionId,
          selectedOption,
          ...(timeTaken !== undefined ? { timeTaken } : {}),
        },
      }),

      invalidatesTags: (_result, _error, { sessionId }) => [
        {
          type: "ExamSession",
          id: sessionId,
        },
      ],
    }),

    // -----------------------------------------------------
    // SUBMIT EXAM
    // -----------------------------------------------------
    submitExam: builder.mutation<SubmitExamResponse, string>({
      query: (sessionId) => ({
        url: `/exam/${sessionId}/submit`,
        method: "POST",
      }),

      invalidatesTags: (_result, _error, sessionId) => [
        {
          type: "ExamSession",
          id: sessionId,
        },
      ],
    }),
  }),

  overrideExisting: false,
})

// =========================================================
// HOOKS
// =========================================================

export const {
  useStartExamMutation,
  useGetExamSessionQuery,
  useSubmitAnswerMutation,
  useSubmitExamMutation,
} = examEngineApi
