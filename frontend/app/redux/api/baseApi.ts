import {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
  createApi,
  fetchBaseQuery,
} from "@reduxjs/toolkit/query/react"

import { clearCredentials } from "../slices/authSlice"

const rawBaseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_API_URL,
  credentials: "include",
})

const baseQueryWithReAuth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await rawBaseQuery(args, api, extraOptions)

  // don't try refreshing if the refresh endpoint itself failed
  const isRefreshRequest =
    typeof args !== "string" && args.url?.includes("/auth/refresh-token")

  if (result.error?.status === 401 && !isRefreshRequest) {
    console.log("401 received. Trying refresh...")

    const refreshResult = await rawBaseQuery(
      {
        url: "/auth/refresh-token",
        method: "POST",
      },
      api,
      extraOptions
    )

    console.log("Refresh Result:", refreshResult)

    if (refreshResult.data) {
      result = await rawBaseQuery(args, api, extraOptions)
    } else {
      api.dispatch(clearCredentials())
      api.dispatch(baseApi.util.resetApiState())
    }
  }

  return result
}

export const baseApi = createApi({
  reducerPath: "baseApi",

  baseQuery: baseQueryWithReAuth,

  tagTypes: [
    "User",
    "Auth",
    "Question",
    "PracticeSet",
    "ModelTest",
    "Result",
    "Analytics",
    "Subject",
    "Chapter",
    "Topic",
    "ExamSession",
    "ExamResult",
    "QuestionSubmission",
    "QuestionBanks",
    "QuestionBankItem",
    "PdfImport",
  ],

  refetchOnReconnect: true,

  refetchOnFocus: true,

  endpoints: () => ({}),
})
