import { baseApi } from "./baseApi"

export interface IRevenueChart {
  label: string
  value: number
}

export interface IUserGrowth {
  label: string
  users: number
}

export interface IQuestionGrowth {
  label: string
  questions: number
}

export interface IAccuracy {
  name: string
  value: number
}

export interface IPopularSubject {
  subject: string
  attempts: number
}

export interface ILiveActivity {
  id: string
  title: string
  description: string
  createdAt: string
  type: "EXAM" | "QUESTION" | "PAYMENT" | "AI" | "POINT"
}

export interface IServerStatus {
  api: string
  database: string
  redis: string
  ai: string
  storage: string
}

export interface IAdminDashboard {
  totalUsers: number

  todayRegistrations: number

  premiumUsers: number

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
