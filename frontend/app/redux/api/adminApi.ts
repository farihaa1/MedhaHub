import { baseApi } from "./baseApi"

export interface IAdminDashboard {
  totalUsers: number
  totalSubjects: number
  totalChapters: number
  totalTopics: number
  totalQuestions: number
  pendingSubmissions: number
}

export interface IApiResponse<T> {
  success: boolean
  message: string
  data: T
}

export const adminApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDashboard: builder.query<IApiResponse<IAdminDashboard>, void>({
      query: () => ({
        url: "/admin/dashboard",
        method: "GET",
      }),
      providesTags: ["Analytics"],
    }),
  }),
})

export const { useGetDashboardQuery } = adminApi
