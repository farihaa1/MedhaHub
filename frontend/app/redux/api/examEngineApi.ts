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

    getExamSession: builder.query({
      query: (sessionId) => ({
        url: `/exam-session/${sessionId}`,
        method: "GET",
      }),
    }),

    submitAnswer: builder.mutation({
      query: (data) => ({
        url: `/exam-session/${data.sessionId}/answer`,
        method: "POST",
        body: data,
      }),
    }),

    submitExam: builder.mutation({
      query: (data) => ({
        url: `/exam-session/${data.sessionId}/submit`,
        method: "POST",
      }),
    }),
  }),
})

export const {
  useStartExamMutation,
  useGetExamSessionQuery,
  useSubmitAnswerMutation,
  useSubmitExamMutation,
} = examEngineApi
