// app/redux/api/topicContentApi.ts

import { baseApi } from "./baseApi"

import {
  ITopicContent,
  TopicContentApiResponse,
  CreateTopicContentPayload,
  UpdateTopicContentPayload,
} from "../types/topicContent"

export const topicContentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // =========================================================
    // CREATE
    // =========================================================

    createTopicContent: builder.mutation<
      TopicContentApiResponse,
      CreateTopicContentPayload
    >({
      query: (body) => ({
        url: "/topic-content",
        method: "POST",
        body,
      }),

      invalidatesTags: ["TopicContent"],
    }),

    // =========================================================
    // GET CONTENT BY TOPIC
    // =========================================================

    getTopicContent: builder.query<TopicContentApiResponse, string>({
      query: (topicId) => `/topic-content/topic/${topicId}`,

      providesTags: (_result, _error, topicId) => [
        {
          type: "TopicContent",
          id: topicId,
        },
      ],
    }),

    // =========================================================
    // GET PUBLISHED CONTENT
    // =========================================================

    getPublishedTopicContent: builder.query<TopicContentApiResponse, string>({
      query: (topicId) => `/topic-content/topic/${topicId}/published`,

      providesTags: (_result, _error, topicId) => [
        {
          type: "TopicContent",
          id: `published-${topicId}`,
        },
      ],
    }),

    // =========================================================
    // UPDATE
    // =========================================================

    updateTopicContent: builder.mutation<
      TopicContentApiResponse,
      {
        topicId: string
        data: UpdateTopicContentPayload
      }
    >({
      query: ({ topicId, data }) => ({
        url: `/topic-content/topic/${topicId}`,
        method: "PATCH",
        body: data,
      }),

      invalidatesTags: (_result, _error, { topicId }) => [
        {
          type: "TopicContent",
          id: topicId,
        },
        {
          type: "TopicContent",
          id: `published-${topicId}`,
        },
      ],
    }),

    // =========================================================
    // UPSERT
    // =========================================================

    upsertTopicContent: builder.mutation<
      TopicContentApiResponse,
      {
        topicId: string
        data: UpdateTopicContentPayload
      }
    >({
      query: ({ topicId, data }) => ({
        url: `/topic-content/topic/${topicId}`,
        method: "PUT",
        body: data,
      }),

      invalidatesTags: (_result, _error, { topicId }) => [
        {
          type: "TopicContent",
          id: topicId,
        },
        {
          type: "TopicContent",
          id: `published-${topicId}`,
        },
      ],
    }),

    // =========================================================
    // DELETE
    // =========================================================

    deleteTopicContent: builder.mutation<TopicContentApiResponse, string>({
      query: (topicId) => ({
        url: `/topic-content/topic/${topicId}`,
        method: "DELETE",
      }),

      invalidatesTags: (_result, _error, topicId) => [
        {
          type: "TopicContent",
          id: topicId,
        },
        {
          type: "TopicContent",
          id: `published-${topicId}`,
        },
      ],
    }),
  }),

  overrideExisting: false,
})

export const {
  useCreateTopicContentMutation,
  useGetTopicContentQuery,
  useGetPublishedTopicContentQuery,
  useUpdateTopicContentMutation,
  useUpsertTopicContentMutation,
  useDeleteTopicContentMutation,
} = topicContentApi
