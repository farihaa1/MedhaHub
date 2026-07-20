import { baseApi } from "./baseApi"

export const questionBankApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getQuestionBanks: builder.query({
      query: (params) => ({
        url: "/question-bank",
        method: "GET",
        params,
      }),
      providesTags: ["QuestionBank"],
    }),

    getQuestionBank: builder.query({
      query: (id: string) => ({
        url: `/question-bank/${id}`,
        method: "GET",
      }),
      providesTags: ["QuestionBank"],
    }),

    createQuestionBank: builder.mutation({
      query: (data) => ({
        url: "/question-bank",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["QuestionBank"],
    }),

    updateQuestionBank: builder.mutation({
      query: ({ id, data }) => ({
        url: `/question-bank/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["QuestionBank"],
    }),

    deleteQuestionBank: builder.mutation({
      query: (id: string) => ({
        url: `/question-bank/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["QuestionBank"],
    }),
  }),
})

export const {
  useGetQuestionBanksQuery,
  useGetQuestionBankQuery,
  useCreateQuestionBankMutation,
  useUpdateQuestionBankMutation,
  useDeleteQuestionBankMutation,
} = questionBankApi
