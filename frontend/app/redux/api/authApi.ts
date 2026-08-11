"use client"

import { baseApi } from "./baseApi"

import type {
  AuthResponse,
  ChangePasswordInput,
  IApiResponse,
  IUser,
  RegisterInput,
  UpdateProfileInput,
  ILoginInput,
} from "@/app/redux/types/auth.type"

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // =====================================================
    // REGISTER
    // =====================================================

    register: builder.mutation<AuthResponse, RegisterInput>({
      query: (body) => ({
        url: "/auth/register",
        method: "POST",
        body,
        credentials: "include",
      }),

      invalidatesTags: ["User", "Auth"],
    }),

    // =====================================================
    // LOGIN
    // =====================================================

    login: builder.mutation<AuthResponse, ILoginInput>({
      query: (body) => ({
        url: "/auth/login",
        method: "POST",
        body,
        credentials: "include",
      }),

      invalidatesTags: ["User", "Auth"],
    }),

    // =====================================================
    // GOOGLE LOGIN
    // =====================================================

    googleLogin: builder.mutation<AuthResponse, { idToken: string }>({
      query: (body) => ({
        url: "/auth/google",
        method: "POST",
        body,
        credentials: "include",
      }),

      invalidatesTags: ["User", "Auth"],
    }),

    // =====================================================
    // CURRENT USER
    // =====================================================

    me: builder.query<IApiResponse<IUser>, void>({
      query: () => ({
        url: "/auth/me",
        method: "GET",
        credentials: "include",
      }),

      providesTags: ["User"],
    }),

    // =====================================================
    // REFRESH TOKEN
    // =====================================================

    refreshToken: builder.mutation<IApiResponse<IUser>, void>({
      query: () => ({
        url: "/auth/refresh-token",
        method: "POST",
        credentials: "include",
      }),

      invalidatesTags: ["User", "Auth"],
    }),

    // =====================================================
    // LOGOUT
    // =====================================================

    logout: builder.mutation<IApiResponse<null>, void>({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
        credentials: "include",
      }),

      invalidatesTags: ["User", "Auth"],
    }),

    // =====================================================
    // UPDATE PROFILE
    // =====================================================

    updateProfile: builder.mutation<IApiResponse<IUser>, UpdateProfileInput>({
      query: (body) => ({
        url: "/auth/profile",
        method: "PATCH",
        body,
        credentials: "include",
      }),

      invalidatesTags: ["User"],
    }),

    // =====================================================
    // CHANGE PASSWORD
    // =====================================================

    changePassword: builder.mutation<IApiResponse<null>, ChangePasswordInput>({
      query: (body) => ({
        url: "/auth/change-password",
        method: "POST",
        body,
        credentials: "include",
      }),
    }),

    // =====================================================
    // IS ADMIN
    // =====================================================

    isAdmin: builder.query<boolean, void>({
      query: () => ({
        url: "/users/is-admin",
        method: "GET",
        credentials: "include",
      }),

      providesTags: ["User"],
    }),
  }),

  overrideExisting: false,
})

export const {
  useRegisterMutation,
  useLoginMutation,
  useGoogleLoginMutation,
  useMeQuery,
  useRefreshTokenMutation,
  useLogoutMutation,
  useUpdateProfileMutation,
  useChangePasswordMutation,
  useIsAdminQuery,
} = authApi
