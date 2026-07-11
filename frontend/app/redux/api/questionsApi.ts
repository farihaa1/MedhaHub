import { IApiResponse } from "@/app/features/auth/auth.type"
import { baseApi } from "./baseApi"

export enum QuestionStatus {
  Draft = "draft",
  Approved = "approved",
}

export type OptionLabel = "A" | "B" | "C" | "D"

export interface IQuestionOption {
  label: OptionLabel
  text: string
}

export interface IExamInfo {
  category: "BCS" | "Bank" | "Primary" | "NTRCA" | "Other"
  examName?: string
  year?: number
}

export interface IQuestion {
  _id: string

  // Relations
  subjectId: string
  chapterId: string
  topicId: string

  // Question
  questionText: string

  options: IQuestionOption[]

  correctAnswer: OptionLabel

  // Learning
  explanation?: string

  // Exam Information
  examInfo?: IExamInfo

  // Search
  tags?: string[]

  // Management
  status: QuestionStatus

  createdBy?: string

  createdAt?: string
  updatedAt?: string
}

export const questionsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get all questions
    getQuestions: builder.query<IApiResponse<IQuestion[]>, void>({
      query: () => ({
        url: "/questions",
        method: "GET",
      }),
      providesTags: ["Question"],
    }),

    // Get single question
    getQuestion: builder.query<IApiResponse<IQuestion>, string>({
      query: (id) => ({
        url: `/questions/${id}`,
        method: "GET",
      }),
      providesTags: (_result, _error, id) => [{ type: "Question", id }],
    }),

    // Get questions by topic
    getQuestionsByTopic: builder.query<IApiResponse<IQuestion[]>, string>({
      query: (topicId) => ({
        url: `/questions/topic/${topicId}`,
        method: "GET",
      }),
      providesTags: (_result, _error, topicId) => [
        { type: "Question", id: topicId },
      ],
    }),

    // Create question
    createQuestion: builder.mutation<
      IApiResponse<IQuestion>,
      Partial<IQuestion>
    >({
      query: (body) => ({
        url: "/questions",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Question"],
    }),

    // Update question
    updateQuestion: builder.mutation<
      IApiResponse<IQuestion>,
      {
        id: string
        data: Partial<IQuestion>
      }
    >({
      query: ({ id, data }) => ({
        url: `/questions/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        "Question",
        { type: "Question", id },
      ],
    }),

    // Delete question
    deleteQuestion: builder.mutation<IApiResponse<null>, string>({
      query: (id) => ({
        url: `/questions/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Question"],
    }),
  }),

  overrideExisting: false,
})

export const {
  useGetQuestionsQuery,
  useGetQuestionQuery,
  useGetQuestionsByTopicQuery,
  useCreateQuestionMutation,
  useUpdateQuestionMutation,
  useDeleteQuestionMutation,
} = questionsApi
