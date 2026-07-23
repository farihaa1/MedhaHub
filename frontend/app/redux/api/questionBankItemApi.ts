import { baseApi } from "./baseApi"
import {
  IQuestionBankQuestion,
  IPaginatedResponse,
} from "../types/questionBank.types"

export const questionBankItemApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getQuestionsByBank: builder.query<
      IPaginatedResponse<IQuestionBankQuestion>,
      {
        questionBankId: string
        page?: number
        limit?: number
        searchTerm?: string
      }
    >({
      query: ({ questionBankId, ...params }) => ({
        url: `/question-bank-items/${questionBankId}/questions`,
        params,
      }),

      providesTags: (result, _error, { questionBankId }) =>
        result
          ? [
              ...result.data.map((item) => ({
                type: "QuestionBankItem" as const,
                id: item._id,
              })),
              {
                type: "QuestionBankItem",
                id: questionBankId,
              },
            ]
          : [
              {
                type: "QuestionBankItem",
                id: questionBankId,
              },
            ],
    }),

    addQuestionToBank: builder.mutation({
      query: ({ questionBankId, data }) => ({
        url: `/question-bank-items/${questionBankId}/questions`,
        method: "POST",
        body: data,
      }),

      invalidatesTags: (_r, _e, { questionBankId }) => [
        { type: "QuestionBankItem", id: questionBankId },
        { type: "QuestionBank", id: questionBankId },
      ],
    }),

    bulkAddQuestions: builder.mutation({
      query: ({ questionBankId, questionIds }) => ({
        url: `/question-bank-items/${questionBankId}/questions/bulk`,
        method: "POST",
        body: {
          questionIds,
        },
      }),

      invalidatesTags: (_r, _e, { questionBankId }) => [
        { type: "QuestionBankItem", id: questionBankId },
        { type: "QuestionBank", id: questionBankId },
      ],
    }),

    updateQuestionBankItem: builder.mutation({
      query: ({ id, data }) => ({
        url: `/question-bank-items/items/${id}`,
        method: "PATCH",
        body: data,
      }),

      invalidatesTags: (_r, _e, { id }) => [
        {
          type: "QuestionBankItem",
          id,
        },
      ],
    }),

    removeQuestionFromBank: builder.mutation({
      query: ({ questionBankId, questionId }) => ({
        url: `/question-bank-items/${questionBankId}/questions/${questionId}`,
        method: "DELETE",
      }),

      invalidatesTags: (_r, _e, { questionBankId }) => [
        { type: "QuestionBankItem", id: questionBankId },
        { type: "QuestionBank", id: questionBankId },
      ],
    }),

    reorderQuestions: builder.mutation({
      query: ({ questionBankId, items }) => ({
        url: `/question-bank-items/${questionBankId}/reorder`,
        method: "PATCH",
        body: { items },
      }),

      invalidatesTags: (_r, _e, { questionBankId }) => [
        { type: "QuestionBankItem", id: questionBankId },
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
