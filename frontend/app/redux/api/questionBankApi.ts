import {
  IPaginatedResponse,
  IQuestionBank,
  IQuestionBankFilters,
  IQuestionBankPayload,
  IApiResponse,
} from "../types/questionBank.types"
import { baseApi } from "./baseApi"

export const questionBankApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getQuestionBanks: builder.query<
      IApiResponse<IPaginatedResponse<IQuestionBank>>,
      IQuestionBankFilters
    >({
      query: (params) => ({
        url: "/question-bank",
        params,
      }),

      providesTags: (result) =>
        result
          ? [
              ...result.data.data.map((bank) => ({
                type: "QuestionBank" as const,
                id: bank._id,
              })),
              { type: "QuestionBank", id: "LIST" },
            ]
          : [{ type: "QuestionBank", id: "LIST" }],
    }),

    getQuestionBank: builder.query<IApiResponse<IQuestionBank>, string>({
      query: (id) => `/question-bank/${id}`,

      providesTags: (_result, _error, id) => [{ type: "QuestionBank", id }],
    }),

    createQuestionBank: builder.mutation<
      IApiResponse<IQuestionBank>,
      IQuestionBankPayload
    >({
      query: (body) => ({
        url: "/question-bank",
        method: "POST",
        body,
      }),

      invalidatesTags: [{ type: "QuestionBank", id: "LIST" }],
    }),

    updateQuestionBank: builder.mutation<
      IApiResponse<IQuestionBank>,
      {
        id: string
        data: Partial<IQuestionBankPayload>
      }
    >({
      query: ({ id, data }) => ({
        url: `/question-bank/${id}`,
        method: "PATCH",
        body: data,
      }),

      invalidatesTags: (_r, _e, { id }) => [
        { type: "QuestionBank", id },
        { type: "QuestionBank", id: "LIST" },
      ],
    }),

    deleteQuestionBank: builder.mutation<IApiResponse<null>, string>({
      query: (id) => ({
        url: `/question-bank/${id}`,
        method: "DELETE",
      }),

      invalidatesTags: (_r, _e, id) => [
        { type: "QuestionBank", id },
        { type: "QuestionBank", id: "LIST" },
      ],
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
