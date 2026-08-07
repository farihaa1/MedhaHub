import { LoginInput } from "@/app/features/auth/schemas/login.schema"
import { baseApi } from "./baseApi"

import {
  AuthResponse,
  ChangePasswordInput,
  IApiResponse,
  IUser,
  RegisterInput,
  UpdateProfileInput,
} from "@/app/features/auth/auth.type"

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ==========================
    // Register
    // ==========================

    register: builder.mutation<AuthResponse, RegisterInput>({
      query: (body) => ({
        url: "/auth/register",
        method: "POST",
        body,
        credentials: "include",
      }),
      invalidatesTags: ["User", "Auth"],
    }),

    // ==========================
    // Login
    // ==========================

    login: builder.mutation<AuthResponse, LoginInput>({
      query: (body) => ({
        url: "/auth/login",
        method: "POST",
        body,
        credentials: "include",
      }),

      invalidatesTags: ["User", "Auth"],
    }),

    // ==========================
    // Current User
    // ==========================

    me: builder.query<IApiResponse<IUser>, void>({
      query: () => ({
        url: "/auth/me",
        method: "GET",
        credentials: "include",
      }),

      providesTags: ["User"],

      keepUnusedDataFor: 300,
    }),

    // ==========================
    // Refresh Token
    // ==========================

    refreshToken: builder.mutation<AuthResponse, void>({
      query: () => ({
        url: "/auth/refresh-token",
        method: "POST",
        credentials: "include",
      }),
    }),

    // ==========================
    // Logout
    // ==========================

    logout: builder.mutation<IApiResponse<null>, void>({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
        credentials: "include",
      }),

      invalidatesTags: ["User", "Auth"],
    }),

    // ==========================
    // Update Profile
    // ==========================

    updateProfile: builder.mutation<IApiResponse<IUser>, UpdateProfileInput>({
      query: (body) => ({
        url: "/auth/profile",
        method: "PATCH",
        body,
        credentials: "include",
      }),

      invalidatesTags: ["User"],
    }),

    // ==========================
    // Change Password
    // ==========================

    changePassword: builder.mutation<IApiResponse<null>, ChangePasswordInput>({
      query: (body) => ({
        url: "/auth/change-password",
        method: "POST",
        body,
        credentials: "include",
      }),
    }),

    // ==========================
    // Is Admin
    // ==========================

    isAdmin: builder.query<boolean, void>({
      query: () => ({
        url: "/users/is-admin",
        method: "GET",
        credentials: "include",
      }),
    }),
  }),

  overrideExisting: false,
})

export const {
  useRegisterMutation,
  useLoginMutation,
  useMeQuery,
  useRefreshTokenMutation,
  useLogoutMutation,
  useUpdateProfileMutation,
  useChangePasswordMutation,
  useIsAdminQuery,
} = authApi
