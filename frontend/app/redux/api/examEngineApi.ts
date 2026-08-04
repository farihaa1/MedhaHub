import { ExamSessionResponse, ResultResponse } from "../types/exam.type"
import { baseApi } from "./baseApi"

export const examEngineApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    startExam: builder.mutation({
      query: (data) => ({
        url: "/exam-engine/start",
        method: "POST",
        body: data,
        credentials: "include",
      }),
    }),

    getExamSession: builder.query<ExamSessionResponse, string>({
      query: (sessionId) => ({
        url: `/exam/${sessionId}`,
        method: "GET",
      }),
    }),

    submitAnswer: builder.mutation({
      query: (data) => ({
        url: `/exam/${data.sessionId}/answer`,
        method: "POST",
        body: data,
      }),
    }),

    submitExam: builder.mutation({
      query: (data) => ({
        url: `/exam/${data.sessionId}/submit`,
        method: "POST",
      }),
    }),

    getResult: builder.query<ResultResponse, string>({
      query: (sessionId) => ({
        url: `/result/${sessionId}`,
        method: "GET",
      }),
    }),
  }),
})

export const {
  useStartExamMutation,
  useGetExamSessionQuery,
  useSubmitAnswerMutation,
  useSubmitExamMutation,
  useGetResultQuery,
} = examEngineApi
