import {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
  fetchBaseQuery,
  createApi,
} from "@reduxjs/toolkit/query/react"

import type { RootState } from "../store"

import { clearCredentials, setCredentials } from "../slices/authSlice"

import type { IUser } from "../types/auth.type"

const rawBaseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_API_URL,

  credentials: "include",

  prepareHeaders: (headers, { getState }) => {
    const state = getState() as RootState

    /*
     * IMPORTANT:
     *
     * Your backend uses HttpOnly cookies.
     *
     * Therefore the browser already sends accessToken
     * through credentials: "include".
     *
     * We do NOT need to read the accessToken from Redux.
     */

    headers.set("Content-Type", "application/json")

    return headers
  },
})

let isRefreshing = false

const baseQueryWithReAuth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await rawBaseQuery(args, api, extraOptions)

  /*
   * =====================================================
   * ACCESS TOKEN EXPIRED
   * =====================================================
   */

  if (result.error?.status === 401) {
    /*
     * NEVER refresh when the current request itself
     * is the refresh endpoint.
     *
     * Otherwise:
     *
     * refresh-token → 401
     *       ↓
     * refresh-token → 401
     *       ↓
     * infinite loop
     */

    const requestUrl = typeof args === "string" ? args : args.url

    if (requestUrl === "/auth/refresh-token") {
      api.dispatch(clearCredentials())

      return result
    }

    /*
     * Avoid multiple simultaneous refresh requests.
     */

    if (!isRefreshing) {
      isRefreshing = true

      try {
        const refreshResult = await rawBaseQuery(
          {
            url: "/auth/refresh-token",
            method: "POST",
            credentials: "include",
          },
          api,
          extraOptions
        )

        if (refreshResult.data) {
          const response = refreshResult.data as {
            success: boolean
            message: string
            data: IUser | null
          }

          if (response.success && response.data) {
            /*
             * Backend already set new HttpOnly cookies.
             *
             * Store only the user in Redux.
             */

            api.dispatch(setCredentials(response.data))

            /*
             * Retry original request.
             */

            result = await rawBaseQuery(args, api, extraOptions)
          } else {
            api.dispatch(clearCredentials())
          }
        } else {
          api.dispatch(clearCredentials())
        }
      } catch {
        api.dispatch(clearCredentials())
      } finally {
        isRefreshing = false
      }
    }
  }

  return result
}

/*
 * =========================================================
 * BASE API
 * =========================================================
 */

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
    "DuplicateDetector",
    "TopicContent",
  ],

  endpoints: () => ({}),
})
