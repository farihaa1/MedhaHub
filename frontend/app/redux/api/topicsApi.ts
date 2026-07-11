import { IApiResponse } from "@/app/features/auth/auth.type"
import { baseApi } from "./baseApi"

export enum TopicStatus {
  Draft = "draft",
  Approved = "approved",
}

export interface ITopic {
  _id: string
  chapterId: string
  subjectId?: string
  title: string
  slug: string
  order: number
  status: TopicStatus
  totalQuestions: number
  progress: number
}

export const topicsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get all topics
    getTopics: builder.query<IApiResponse<ITopic[]>, void>({
      query: () => ({
        url: "/topics",
        method: "GET",
      }),
      providesTags: ["Topic"],
    }),

    // Get single topic
    getTopic: builder.query<IApiResponse<ITopic>, string>({
      query: (id) => ({
        url: `/topics/${id}`,
        method: "GET",
      }),
      providesTags: (_result, _error, id) => [{ type: "Topic", id }],
    }),

    // Get topics by chapter
    getTopicsByChapter: builder.query<IApiResponse<ITopic[]>, string>({
      query: (chapterId) => ({
        url: `/topics/chapter/${chapterId}`,
        method: "GET",
      }),
      providesTags: (_result, _error, chapterId) => [
        { type: "Topic", id: chapterId },
      ],
    }),

    // Create topic
    createTopic: builder.mutation<IApiResponse<ITopic>, Partial<ITopic>>({
      query: (body) => ({
        url: "/topics",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Topic"],
    }),

    // Update topic
    updateTopic: builder.mutation<
      IApiResponse<ITopic>,
      { id: string; data: Partial<ITopic> }
    >({
      query: ({ id, data }) => ({
        url: `/topics/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        "Topic",
        { type: "Topic", id },
      ],
    }),

    // Delete topic
    deleteTopic: builder.mutation<IApiResponse<null>, string>({
      query: (id) => ({
        url: `/topics/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Topic"],
    }),
  }),

  overrideExisting: false,
})

export const {
  useGetTopicsQuery,
  useGetTopicQuery,
  useGetTopicsByChapterQuery,
  useCreateTopicMutation,
  useUpdateTopicMutation,
  useDeleteTopicMutation,
} = topicsApi
