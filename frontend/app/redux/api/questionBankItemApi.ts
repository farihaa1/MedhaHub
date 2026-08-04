import { baseApi } from "./baseApi"

import {
  IAddQuestionToBankPayload,
  IApiResponse,
  IBulkAddQuestionsPayload,
  IPaginatedResponse,
  IQuestionBankItem,
  IQuestionBankQuestion,
  IReorderQuestion,
} from "../types/questionBank.types"

interface GetQuestionsByBankParams {
  questionBankId: string
  page?: number
  limit?: number
  searchTerm?: string
}

export const questionBankItemApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    /* ==========================================================
       Get Questions By Bank
    ========================================================== */

    getQuestionsByBank: builder.query<
      IApiResponse<IPaginatedResponse<IQuestionBankQuestion>>,
      GetQuestionsByBankParams
    >({
      query: ({ questionBankId, ...params }) => ({
        url: `/question-bank-items/${questionBankId}/questions`,
        method: "GET",
        params,
      }),

      providesTags: (_result, _error, { questionBankId }) => [
        {
          type: "QuestionBankItem",
          id: questionBankId,
        },
      ],
    }),

    /* ==========================================================
       Add Question
    ========================================================== */

    addQuestionToBank: builder.mutation<
      IApiResponse<IQuestionBankItem>,
      {
        questionBankId: string
        data: IAddQuestionToBankPayload
      }
    >({
      query: ({ questionBankId, data }) => ({
        url: `/question-bank-items/${questionBankId}/questions`,
        method: "POST",
        body: data,
      }),

      invalidatesTags: (_result, _error, { questionBankId }) => [
        {
          type: "QuestionBankItem",
          id: questionBankId,
        },
        {
          type: "QuestionBanks",
          id: questionBankId,
        },
      ],
    }),

    /* ==========================================================
       Bulk Add
    ========================================================== */

    bulkAddQuestions: builder.mutation<
      IApiResponse<IQuestionBankItem[]>,
      {
        questionBankId: string
        data: IBulkAddQuestionsPayload
      }
    >({
      query: ({ questionBankId, data }) => ({
        url: `/question-bank-items/${questionBankId}/questions/bulk`,
        method: "POST",
        body: data,
      }),

      invalidatesTags: (_result, _error, { questionBankId }) => [
        {
          type: "QuestionBankItem",
          id: questionBankId,
        },
        {
          type: "QuestionBanks",
          id: questionBankId,
        },
      ],
    }),

    /* ==========================================================
       Update Item
    ========================================================== */

    updateQuestionBankItem: builder.mutation<
      IApiResponse<IQuestionBankItem>,
      {
        id: string
        data: Partial<IQuestionBankItem>
      }
    >({
      query: ({ id, data }) => ({
        url: `/question-bank-items/items/${id}`,
        method: "PATCH",
        body: data,
      }),

      invalidatesTags: (_result, _error, { id }) => [
        {
          type: "QuestionBankItem",
          id,
        },
      ],
    }),

    /* ==========================================================
       Remove Question
    ========================================================== */

    removeQuestionFromBank: builder.mutation<
      IApiResponse<void>,
      {
        questionBankId: string
        questionId: string
      }
    >({
      query: ({ questionBankId, questionId }) => ({
        url: `/question-bank-items/${questionBankId}/questions/${questionId}`,
        method: "DELETE",
      }),

      invalidatesTags: (_result, _error, { questionBankId }) => [
        {
          type: "QuestionBankItem",
          id: questionBankId,
        },
        {
          type: "QuestionBanks",
          id: questionBankId,
        },
      ],
    }),

    /* ==========================================================
       Reorder
    ========================================================== */

    reorderQuestions: builder.mutation<
      IApiResponse<IQuestionBankItem[]>,
      {
        questionBankId: string
        items: IReorderQuestion[]
      }
    >({
      query: ({ questionBankId, items }) => ({
        url: `/question-bank-items/${questionBankId}/reorder`,
        method: "PATCH",
        body: { items },
      }),

      invalidatesTags: (_result, _error, { questionBankId }) => [
        {
          type: "QuestionBankItem",
          id: questionBankId,
        },
      ],
    }),
  }),
})

export const {
  useGetQuestionsByBankQuery,
  useAddQuestionToBankMutation,
  useBulkAddQuestionsMutation,
  useUpdateQuestionBankItemMutation,
  useRemoveQuestionFromBankMutation,
  useReorderQuestionsMutation,
} = questionBankItemApi
