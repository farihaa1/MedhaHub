import {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
  createApi,
  fetchBaseQuery,
} from "@reduxjs/toolkit/query/react"

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_API_URL,
  credentials: "include",
})

const MAX_REFRESH_RETRY = 3

let refreshRetryCount = 0
let isRefreshing = false

const logoutUser = async (
  api: Parameters<BaseQueryFn>[1],
  extraOptions: Parameters<BaseQueryFn>[2]
) => {
  try {
    await baseQuery(
      {
        url: "/auth/logout",
        method: "POST",
      },
      api,
      extraOptions
    )
  } catch {}

  refreshRetryCount = 0

  api.dispatch(baseApi.util.resetApiState())

  if (typeof window !== "undefined") {
    window.location.replace("/login")
  }
}

const baseQueryWithReAuth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions)

  // Don't try to refresh while calling refresh endpoint itself
  const url = typeof args === "string" ? args : args.url

  if (
    result.error?.status === 401 &&
    url !== "/auth/login" &&
    url !== "/auth/register" &&
    url !== "/auth/refresh-token"
  ) {
    if (refreshRetryCount >= MAX_REFRESH_RETRY) {
      console.warn("Refresh token failed too many times. Logging out...")
      await logoutUser(api, extraOptions)
      return result
    }

    if (!isRefreshing) {
      isRefreshing = true

      console.log("Access token expired. Trying refresh...")

      const refreshResult = await baseQuery(
        {
          url: "/auth/refresh-token",
          method: "POST",
        },
        api,
        extraOptions
      )

      isRefreshing = false

      if (refreshResult.data) {
        refreshRetryCount = 0

        console.log("Refresh successful.")

        // Retry original request
        result = await baseQuery(args, api, extraOptions)
      } else {
        refreshRetryCount++

        console.warn(
          `Refresh failed (${refreshRetryCount}/${MAX_REFRESH_RETRY})`
        )

        if (refreshRetryCount >= MAX_REFRESH_RETRY) {
          await logoutUser(api, extraOptions)
        }
      }
    }
  }

  return result
}

export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: baseQueryWithReAuth,
  refetchOnReconnect: true,
  refetchOnFocus: true,
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
  endpoints: () => ({}),
})
