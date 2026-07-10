import { IApiResponse } from "@/app/features/auth/auth.type";
import { baseApi } from "./baseApi";
export enum ChapterStatus {
  Draft = "draft",
  Approved = "approved",
}

export interface IChapter {
    _id:string
  subjectId: string
  title: string
  slug: string
  order: number
  status: ChapterStatus
  totalTopics: number
  totalQuestions: number
  progress: number
  userId?: string
}

export const chaptersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get all chapters
    getChapters: builder.query<IApiResponse<IChapter[]>, void>({
      query: () => ({
        url: "/chapters",
        method: "GET",
      }),
      providesTags: ["Chapter"],
    }),

    // Get single chapter
    getChapter: builder.query<IApiResponse<IChapter>, string>({
      query: (id) => ({
        url: `/chapters/${id}`,
        method: "GET",
      }),
      providesTags: (_result, _error, id) => [{ type: "Chapter", id }],
    }),

    // Get chapters by subject
    getChaptersBySubject: builder.query<IApiResponse<IChapter[]>, string>({
      query: (subjectId) => ({
        url: `/subjects/${subjectId}/chapters`,
        method: "GET",
      }),
      providesTags: (_result, _error, subjectId) => [
        { type: "Chapter", id: subjectId },
      ],
    }),

    // Create chapter
    createChapter: builder.mutation<IApiResponse<IChapter>, Partial<IChapter>>({
      query: (body) => ({
        url: "/chapters",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Chapter"],
    }),

    // Update chapter
    updateChapter: builder.mutation<
      IApiResponse<IChapter>,
      { id: string; data: Partial<IChapter> }
    >({
      query: ({ id, data }) => ({
        url: `/chapters/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        "Chapter",
        { type: "Chapter", id },
      ],
    }),

    // Delete chapter
    deleteChapter: builder.mutation<IApiResponse<null>, string>({
      query: (id) => ({
        url: `/chapters/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Chapter"],
    }),
  }),

  overrideExisting: false,
})

export const {
  useGetChaptersQuery,
  useGetChapterQuery,
  useGetChaptersBySubjectQuery,
  useCreateChapterMutation,
  useUpdateChapterMutation,
  useDeleteChapterMutation,
} = chaptersApi