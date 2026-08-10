import { baseApi } from "./baseApi"

import {
  ExamOptionLabel,
  ExamType,
  ExamSession,
  StartExamPayload,
  StartExamResponse,
  GetExamSessionResponse,
  SubmitAnswerPayload,
  SubmitAnswerResponse,
  SubmitExamResponse,
} from "@/app/redux/types/exam.type"

// ============================================================
// API
// ============================================================

export const examEngineApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ======================================================
    // START EXAM
    // ======================================================

    startExam: builder.mutation<StartExamResponse, StartExamPayload>({
      query: (body) => ({
        url: "/exam-engine/start",
        method: "POST",
        body,
      }),
    }),

    // ======================================================
    // GET EXAM SESSION
    // ======================================================

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

    // ======================================================
    // SUBMIT ANSWER
    // ======================================================

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

    // ======================================================
    // SUBMIT EXAM
    // ======================================================

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

// ============================================================
// HOOKS
// ============================================================

export const {
  useStartExamMutation,
  useGetExamSessionQuery,
  useSubmitAnswerMutation,
  useSubmitExamMutation,
} = examEngineApi
