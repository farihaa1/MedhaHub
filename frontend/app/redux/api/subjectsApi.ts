import { ISubject } from "@/app/(dashboard)/subjects/subjects.type"
import { baseApi } from "./baseApi"
import { IApiResponse } from "@/app/features/auth/auth.type"

export const subjectsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSubjects: builder.query<IApiResponse<ISubject[]>, void>({
      query: () => "/subjects",
      providesTags: ["Subject"],
    }),

    getSubject: builder.query<ISubject, string>({
      query: (slug) => `/subjects/${slug}`,
      providesTags: (_r, _e, slug) => [{ type: "Subject", id: slug }],
    }),
  }),

  overrideExisting: false,
})

export const {  useGetSubjectQuery,useGetSubjectsQuery} =
  subjectsApi
