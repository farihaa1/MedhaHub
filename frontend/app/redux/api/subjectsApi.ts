import { ISubject } from "@/app/(dashboard)/subjects/subjects.type"
import { baseApi } from "./baseApi"
import { IApiResponse } from "@/app/features/auth/auth.type"

export const subjectsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSubjects: builder.query<IApiResponse<ISubject[]>, void>({
      query: () => "/subjects",
      providesTags: ["Subject"],
    }),

    getSubject: builder.query<IApiResponse<ISubject>, string>({
      query: (slug) => ({
        url: `/subjects/${slug}`,
        method: "GET",
      }),
      providesTags: (_result, _error, slug) => [{ type: "Subject", id: slug }],
    }),

    createSubject: builder.mutation<IApiResponse<ISubject>, Partial<ISubject>>({
      query: (body) => ({
        url: "/subjects",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Subject"],
    }),

    updateSubject: builder.mutation<
      IApiResponse<ISubject>,
      {
        id: string
        data: Partial<ISubject>
      }
    >({
      query: ({ id, data }) => ({
        url: `/subjects/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        "Subject",
        { type: "Subject", id },
      ],
    }),

    deleteSubject: builder.mutation<IApiResponse<null>, string>({
      query: (id) => ({
        url: `/subjects/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Subject"],
    }),
  }),

  overrideExisting: false,
})

export const {
  useGetSubjectsQuery,
  useGetSubjectQuery,
  useCreateSubjectMutation,
  useUpdateSubjectMutation,
  useDeleteSubjectMutation,
} = subjectsApi
