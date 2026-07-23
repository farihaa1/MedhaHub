import { baseApi } from "./baseApi"
import { IApiResponse } from "@/app/features/auth/auth.type"

/* ==========================================================
   ENUMS
========================================================== */

export enum QuestionStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
}

export enum QuestionType {
  MCQ = "MCQ",
}

export enum QuestionDifficulty {
  EASY = "EASY",
  MEDIUM = "MEDIUM",
  HARD = "HARD",
}

export enum QuestionSourceType {
  BCS = "BCS",
  NTRCA = "NTRCA",
  PRIMARY = "PRIMARY",
  BANK = "BANK",
  UNIVERSITY = "UNIVERSITY",
  MEDICAL = "MEDICAL",
  CUSTOM = "CUSTOM",
}

/* ==========================================================
   COMMON TYPES
========================================================== */

export interface IEntityRef {
  _id: string
  title: string
}

export interface IQuestionOption {
  _id?: string

  text: string

  image?: string | null

  isCorrect: boolean
}

export interface IQuestionSource {
  type: QuestionSourceType

  name: string

  year?: number
}

/* ==========================================================
   QUESTION
========================================================== */

export interface IQuestion {
  _id: string

  subjectId: IEntityRef

  chapterId: IEntityRef

  topicId: IEntityRef

  type: QuestionType

  questionText: string

  questionImage?: string | null

  options: IQuestionOption[]

  explanation?: string

  explanationImage?: string | null

  sources?: IQuestionSource[]

  tags?: string[]

  difficulty: QuestionDifficulty

  status: QuestionStatus

  marks?: number

  negativeMarks?: number

  createdBy?: string

  approvedBy?: string

  approvedAt?: string

  createdAt: string

  updatedAt: string
}

/* ==========================================================
   REQUEST TYPES
========================================================== */

export type CreateQuestionPayload = Omit<
  IQuestion,
  "_id" | "createdAt" | "updatedAt"
>

export type UpdateQuestionPayload = Partial<CreateQuestionPayload>

export interface QuestionQuery {
  page?: number

  limit?: number

  searchTerm?: string

  subjectId?: string

  chapterId?: string

  topicId?: string

  difficulty?: QuestionDifficulty

  status?: QuestionStatus

  type?: QuestionType

  source?: QuestionSourceType

  sortBy?: string

  sortOrder?: "asc" | "desc"
}

/* ==========================================================
   PAGINATION
========================================================== */

export interface QuestionMeta {
  page: number

  limit: number

  total: number

  totalPage: number
}

export interface PaginatedQuestionResponse {
  meta: QuestionMeta

  data: IQuestion[]
}

/* ==========================================================
   STATS
========================================================== */

export interface IQuestionStats {
  total: number

  published: number

  draft: number

  pending: number

  rejected: number

  premium: number

  reported: number

  today: number
}

export interface IQuestionStatsResponse {
  success: boolean

  data: IQuestionStats
}

/* ==========================================================
   API
========================================================== */

export const questionsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getQuestions: builder.query<
      IApiResponse<PaginatedQuestionResponse>,
      QuestionQuery | undefined
    >({
      query: (params) => ({
        url: "/questions",
        method: "GET",
        params,
      }),

      providesTags: ["Question"],
    }),

    getQuestion: builder.query<IApiResponse<IQuestion>, string>({
      query: (id) => ({
        url: `/questions/${id}`,
      }),

      providesTags: (_result, _error, id) => [
        {
          type: "Question",
          id,
        },
      ],
    }),

    getQuestionsByTopic: builder.query<IApiResponse<IQuestion[]>, string>({
      query: (topicId) => ({
        url: `/questions/topic/${topicId}`,
      }),

      providesTags: (_result, _error, topicId) => [
        {
          type: "Question",
          id: topicId,
        },
      ],
    }),

    createQuestion: builder.mutation<
      IApiResponse<IQuestion>,
      CreateQuestionPayload
    >({
      query: (body) => ({
        url: "/questions",
        method: "POST",
        body,
      }),

      invalidatesTags: ["Question"],
    }),

    bulkCreateQuestions: builder.mutation<
      IApiResponse<IQuestion[]>,
      CreateQuestionPayload[]
    >({
      query: (body) => ({
        url: "/questions/bulk",
        method: "POST",
        body,
      }),

      invalidatesTags: ["Question"],
    }),

    updateQuestion: builder.mutation<
      IApiResponse<IQuestion>,
      {
        id: string
        data: UpdateQuestionPayload
      }
    >({
      query: ({ id, data }) => ({
        url: `/questions/${id}`,
        method: "PATCH",
        body: data,
      }),

      invalidatesTags: (_result, _error, { id }) => [
        "Question",
        {
          type: "Question",
          id,
        },
      ],
    }),

    deleteQuestion: builder.mutation<IApiResponse<IQuestion>, string>({
      query: (id) => ({
        url: `/questions/${id}`,
        method: "DELETE",
      }),

      invalidatesTags: ["Question"],
    }),

    getQuestionStats: builder.query<IQuestionStatsResponse, void>({
      query: () => ({
        url: "/questions/stats",
      }),

      providesTags: ["Question"],
    }),
  }),

  overrideExisting: false,
})

export const {
  useGetQuestionsQuery,
  useGetQuestionQuery,
  useGetQuestionsByTopicQuery,
  useCreateQuestionMutation,
  useBulkCreateQuestionsMutation,
  useUpdateQuestionMutation,
  useDeleteQuestionMutation,
  useGetQuestionStatsQuery,
} = questionsApi
