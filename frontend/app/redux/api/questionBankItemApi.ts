import { baseApi } from "./baseApi"

export const questionBankItemApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getQuestionsByBank: builder.query({
      query: ({ questionBankId, ...params }) => {
        console.log("API QuestionBankId:", questionBankId)

        return {
          url: `/question-bank-items/${questionBankId}/questions`,
          method: "GET",
          params,
        }
      },
    }),

    addQuestionToBank: builder.mutation({
      query: ({ questionBankId, data }) => ({
        url: `/question-bank-items/${questionBankId}/questions`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["QuestionBankItem", "QuestionBank"],
    }),

    bulkAddQuestions: builder.mutation({
      query: ({ questionBankId, questionIds }) => ({
        url: `/question-bank-items/${questionBankId}/questions/bulk`,
        method: "POST",
        body: {
          questionIds,
        },
      }),

      invalidatesTags: ["QuestionBankItem", "QuestionBank"],
    }),

    updateQuestionBankItem: builder.mutation({
      query: ({ id, data }) => ({
        url: `/question-bank-items/items/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["QuestionBankItem"],
    }),

    removeQuestionFromBank: builder.mutation({
      query: ({ questionBankId, questionId }) => ({
        url: `/question-bank-items/${questionBankId}/questions/${questionId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["QuestionBankItem", "QuestionBank"],
    }),

    reorderQuestions: builder.mutation({
      query: ({ questionBankId, items }) => ({
        url: `/question-bank-items/${questionBankId}/reorder`,
        method: "PATCH",
        body: { items },
      }),
      invalidatesTags: ["QuestionBankItem"],
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
