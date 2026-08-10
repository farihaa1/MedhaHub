import { baseApi } from "./baseApi"

import type { ResultReviewResponse } from "@/app/redux/types/result.type"

export const resultApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getResult: builder.query<ResultReviewResponse, string>({
      query: (sessionId) => ({
        url: `/result/${sessionId}`,
        method: "GET",
      }),

      providesTags: (_result, _error, sessionId) => [
        {
          type: "ExamResult",
          id: sessionId,
        },
      ],
    }),
  }),

  overrideExisting: false,
})

export const { useGetResultQuery } = resultApi
