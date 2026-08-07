
import { ReactNode } from "react"
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

export const QuestionSourceType = {
  BCS: "bcs",
  NTRCA: "ntrca",
  PSC_NON_CADRE: "psc-non-cadre",
  BANK: "bank",
  GOVERNMENT: "government",
  DEFENCE: "defence",
  HEALTH: "health",
  ADMISSION: "admission",
  TEACHER: "teacher",
  OTHERS: "others",
  CUSTOM: "custom",
} as const

export type QuestionSourceType =
  (typeof QuestionSourceType)[keyof typeof QuestionSourceType]

export const QUESTION_SOURCE_OPTIONS = Object.entries(
  QuestionSourceType,
).map(([label, value]) => ({
  label: label.replace(/_/g, " "),
  value,
}))

/* ==========================================================
ENTITY
========================================================== */

export interface IEntityRef {
  _id: string
  title: string
}

export type IEntityValue =
  | string
  | IEntityRef
  | null

/* ==========================================================
QUESTION OPTION
========================================================== */

export interface IQuestionOption {
  _id?: string
  label?: string
  text: string
  image?: string | null
  isCorrect: boolean
}

/* ==========================================================
QUESTION SOURCE
========================================================== */

export interface IQuestionSource {
  type: QuestionSourceType
  name: string
  year?: number
}

/* ==========================================================
QUESTION
========================================================== */

export interface IQuestion {
  confidence?: ReactNode
  questionNumber?: ReactNode

  _id: string

  subjectId: IEntityValue
  chapterId: IEntityValue
  topicId: IEntityValue

  type: QuestionType

  questionText: string
  questionImage?: string | null

  options: IQuestionOption[]

  correctAnswer?: string

  explanation?: string
  explanationImage?: string | null

  sources?: IQuestionSource[]
  tags?: string[]

  difficulty?: QuestionDifficulty
  status: QuestionStatus

  createdAt: string
  updatedAt: string
}

/* ==========================================================
CREATE
========================================================== */

export interface CreateQuestionPayload {
  subjectId: string
  chapterId: string
  topicId: string

  questionText: string

  questionImage?: string | null

  options: {
    text: string
    image?: string | null
    isCorrect: boolean
  }[]

  explanation?: string
  explanationImage?: string | null

  difficulty: QuestionDifficulty
  type: QuestionType

  tags: string[]

  sources: {
    type: QuestionSourceType
    name: string
    year?: number
  }[]
}

/* ==========================================================
UPDATE
========================================================== */

export type UpdateQuestionPayload =
  Partial<CreateQuestionPayload>

/* ==========================================================
QUERY
========================================================== */

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
    /* ======================================================
    GET QUESTIONS
    ====================================================== */

    getQuestions: builder.query<
      IApiResponse<PaginatedQuestionResponse>,
      QuestionQuery | undefined
    >({
      query: (params) => ({
        url: "/questions",
        method: "GET",
        params,
      }),

      providesTags: (result) =>
        result?.data?.data
          ? [
              ...result.data.data.map((question) => ({
                type: "Question" as const,
                id: question._id,
              })),
              {
                type: "Question" as const,
                id: "LIST",
              },
            ]
          : [
              {
                type: "Question" as const,
                id: "LIST",
              },
            ],
    }),

    /* ======================================================
    GET SINGLE QUESTION
    ====================================================== */

    getQuestion: builder.query<IApiResponse<IQuestion>, string>({
      query: (id) => ({
        url: `/questions/${id}`,
        method: "GET",
      }),

      providesTags: (_result, _error, id) => [
        {
          type: "Question",
          id,
        },
      ],
    }),

    /* ======================================================
    GET QUESTIONS BY TOPIC
    ====================================================== */

    getQuestionsByTopic: builder.query<IApiResponse<IQuestion[]>, string>({
      query: (topicId) => ({
        url: `/questions/topic/${topicId}`,
        method: "GET",
      }),

      providesTags: (_result, _error, topicId) => [
        {
          type: "Question",
          id: topicId,
        },
      ],
    }),

    /* ======================================================
    CREATE
    ====================================================== */

    createQuestion: builder.mutation<
      IApiResponse<IQuestion>,
      CreateQuestionPayload
    >({
      query: (body) => ({
        url: "/questions",
        method: "POST",
        body,
      }),

      invalidatesTags: ["Question", "Topic", "Chapter"],
    }),

    /* ======================================================
    BULK CREATE
    ====================================================== */

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

    /* ======================================================
    UPDATE
    ====================================================== */

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
        { type: "Question", id },
        { type: "Question", id: "LIST" },
      ],
    }),

    /* ======================================================
    DELETE
    ====================================================== */

    deleteQuestion: builder.mutation<IApiResponse<IQuestion>, string>({
      query: (id) => ({
        url: `/questions/${id}`,
        method: "DELETE",
      }),

      invalidatesTags: ["Question"],
    }),

    /* ======================================================
    STATS
    ====================================================== */

    getQuestionStats: builder.query<IQuestionStatsResponse, void>({
      query: () => ({
        url: "/questions/stats",
      }),

      providesTags: ["Question"],
    }),
  }),

  overrideExisting: false,
})

/* ==========================================================
HOOKS
========================================================== */

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
