import { baseApi } from "./baseApi"

import {
  IApiResponse,
  IPaginatedResponse,
  IQuestionBank,
  IQuestionBankFilters,
  IQuestionBankPayload,
} from "../types/questionBank.types"

export const questionBanksApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    /* ==========================================================
       Get All Question Banks
    ========================================================== */

    getQuestionBanks: builder.query<
      IApiResponse<IPaginatedResponse<IQuestionBank>>,
      IQuestionBankFilters | undefined
    >({
      query: (params) => ({
        url: "/question-banks",
        method: "GET",
        params,
      }),

      providesTags: ["QuestionBanks"],
    }),

    /* ==========================================================
       Category
    ========================================================== */

    getCategoryQuestionBanks: builder.query<
      IApiResponse<IPaginatedResponse<IQuestionBank>>,
      string
    >({
      query: (category) => ({
        url: "/question-banks",
        method: "GET",
        params: {
          category,
          status: "PUBLISHED",
          sort: "-year",
        },
      }),

      providesTags: ["QuestionBanks"],
    }),

    /* ==========================================================
       Single
    ========================================================== */

    getSingleQuestionBank: builder.query<IApiResponse<IQuestionBank>, string>({
      query: (identifier) => ({
        url: `/question-banks/${identifier}`,
      }),

      providesTags: (_result, _error, id) => [
        {
          type: "QuestionBanks",
          id,
        },
      ],
    }),

    /* ==========================================================
       Create
    ========================================================== */

    createQuestionBank: builder.mutation<
      IApiResponse<IQuestionBank>,
      IQuestionBankPayload
    >({
      query: (body) => ({
        url: "/question-banks",
        method: "POST",
        body,
      }),

      invalidatesTags: ["QuestionBanks"],
    }),

    /* ==========================================================
       Bulk Create
    ========================================================== */

    bulkCreateQuestionBanks: builder.mutation<
      IApiResponse<IQuestionBank[]>,
      IQuestionBankPayload[]
    >({
      query: (body) => ({
        url: "/question-banks/bulk-create",
        method: "POST",
        body,
      }),

      invalidatesTags: ["QuestionBanks"],
    }),

    /* ==========================================================
       Update
    ========================================================== */

    updateQuestionBank: builder.mutation<
      IApiResponse<IQuestionBank>,
      {
        id: string
        body: Partial<IQuestionBankPayload>
      }
    >({
      query: ({ id, body }) => ({
        url: `/question-banks/${id}`,
        method: "PATCH",
        body,
      }),

      invalidatesTags: (_result, _error, { id }) => [
        "QuestionBanks",
        {
          type: "QuestionBanks",
          id,
        },
      ],
    }),

    /* ==========================================================
       Publish
    ========================================================== */

    publishQuestionBank: builder.mutation<
      IApiResponse<IQuestionBank>,
      {
        id: string
        body?: unknown
      }
    >({
      query: ({ id, body }) => ({
        url: `/question-banks/${id}/publish`,
        method: "PATCH",
        body,
      }),

      invalidatesTags: ["QuestionBanks"],
    }),

    /* ==========================================================
       Reject
    ========================================================== */

    rejectQuestionBank: builder.mutation<
      IApiResponse<IQuestionBank>,
      {
        id: string
        body?: unknown
      }
    >({
      query: ({ id, body }) => ({
        url: `/question-banks/${id}/reject`,
        method: "PATCH",
        body,
      }),

      invalidatesTags: ["QuestionBanks"],
    }),

    /* ==========================================================
       Archive
    ========================================================== */

    archiveQuestionBank: builder.mutation<IApiResponse<IQuestionBank>, string>({
      query: (id) => ({
        url: `/question-banks/${id}/archive`,
        method: "PATCH",
      }),

      invalidatesTags: ["QuestionBanks"],
    }),

    /* ==========================================================
       Restore
    ========================================================== */

    restoreQuestionBank: builder.mutation<IApiResponse<IQuestionBank>, string>({
      query: (id) => ({
        url: `/question-banks/${id}/restore`,
        method: "PATCH",
      }),

      invalidatesTags: ["QuestionBanks"],
    }),

    /* ==========================================================
       Delete
    ========================================================== */

    deleteQuestionBank: builder.mutation<IApiResponse<void>, string>({
      query: (id) => ({
        url: `/question-banks/${id}`,
        method: "DELETE",
      }),

      invalidatesTags: ["QuestionBanks"],
    }),
  }),
})

export const {
  useGetQuestionBanksQuery,
  useGetCategoryQuestionBanksQuery,
  useGetSingleQuestionBankQuery,
  useCreateQuestionBankMutation,
  useBulkCreateQuestionBanksMutation,
  useUpdateQuestionBankMutation,
  usePublishQuestionBankMutation,
  useRejectQuestionBankMutation,
  useArchiveQuestionBankMutation,
  useRestoreQuestionBankMutation,
  useDeleteQuestionBankMutation,
} = questionBanksApi
