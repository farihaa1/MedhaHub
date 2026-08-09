
import {
  ExamSessionResponse,
  ResultResponse,
} from "../types/exam.type"

import { baseApi } from "./baseApi"

// ==========================================================
// REQUEST TYPES
// ==========================================================

export interface StartExamPayload {
  examType: string

  topicIds?: string[]
  chapterIds?: string[]
  subjectIds?: string[]

  count?: number

  userId?: string
}


export interface SubmitAnswerPayload {
  sessionId: string
  questionId: string
  selectedOption: "A" | "B" | "C" | "D"
}


export interface SubmitExamPayload {
  sessionId: string
}

// ==========================================================
// API
// ==========================================================

export const examEngineApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ======================================================
    // START EXAM
    // ======================================================

    startExam: builder.mutation<
      ExamSessionResponse,
      StartExamPayload
    >({
      query: (data) => ({
        url: "/exam-engine/start",
        method: "POST",
        body: data,
        credentials: "include",
      }),
    }),

    // ======================================================
    // GET EXAM SESSION
    // ======================================================

    getExamSession: builder.query<
      ExamSessionResponse,
      string
    >({
      query: (sessionId) => ({
        url: `/exam/${sessionId}`,
        method: "GET",
      }),
    }),

    // ======================================================
    // SUBMIT ANSWER
    // ======================================================

    submitAnswer: builder.mutation<
      unknown,
      SubmitAnswerPayload
    >({
      query: (data) => ({
        url: `/exam/${data.sessionId}/answer`,
        method: "POST",
        body: data,
      }),
    }),

    // ======================================================
    // SUBMIT EXAM
    // ======================================================

    submitExam: builder.mutation<
      unknown,
      SubmitExamPayload
    >({
      query: ({ sessionId }) => ({
        url: `/exam/${sessionId}/submit`,
        method: "POST",
      }),
    }),

    // ======================================================
    // GET RESULT
    // ======================================================

    getResult: builder.query<ResultResponse, string>({
      query: (sessionId) => ({
        url: `/result/${sessionId}`,
        method: "GET",
      }),
    }),
  }),
})

// ==========================================================
// HOOKS
// ==========================================================

export const {
  useStartExamMutation,
  useGetExamSessionQuery,
  useSubmitAnswerMutation,
  useSubmitExamMutation,
  useGetResultQuery,
} = examEngineApi
