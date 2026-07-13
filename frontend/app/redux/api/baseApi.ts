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

const baseQueryWithReAuth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions)

  if (result.error?.status === 401) {
    console.log("Access token expired. Trying refresh...")

    const refreshResult = await baseQuery(
      {
        url: "/auth/refresh-token",
        method: "POST",
      },
      api,
      extraOptions
    )

    console.log("Refresh result:", refreshResult)

    if (refreshResult.data) {
      result = await baseQuery(args, api, extraOptions)
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
    "Bookmark",
    "Analytics",
    "Subject",
    "Chapter",
    "Topic",
    "ExamSession",
    "ExamResult",
  ],

  endpoints: () => ({}),
})
