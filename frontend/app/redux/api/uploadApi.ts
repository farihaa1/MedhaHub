"use client"

import { baseApi } from "./baseApi"

import type { IApiResponse } from "../types/auth.type"

// ============================================================
// TYPES
// ============================================================

export interface IUploadImageResponse {
  url: string
  publicId: string
  width: number
  height: number
  format: string
  bytes: number
}

// ============================================================
// UPLOAD API
// ============================================================

export const uploadApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    uploadImage: builder.mutation<IApiResponse<IUploadImageResponse>, FormData>(
      {
        query: (formData) => ({
          url: "/upload/image",
          method: "POST",
          body: formData,
          credentials: "include",
        }),
      }
    ),
  }),

  overrideExisting: false,
})

export const { useUploadImageMutation } = uploadApi
