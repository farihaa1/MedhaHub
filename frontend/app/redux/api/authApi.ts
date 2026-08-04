import { LoginInput } from "@/app/features/auth/schemas/login.schema"
import { baseApi } from "./baseApi"

import {
  AuthResponse,
  RegisterInput,
  UpdateProfileInput,
  ChangePasswordInput,
  IUser,
  IApiResponse,
  LoginData,
} from "@/app/features/auth/auth.type"

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ==========================
    // Register
    // ==========================

    register: builder.mutation<IApiResponse<LoginData>, RegisterInput>({
      query: (body) => ({
        url: "/auth/register",
        method: "POST",
        body,
      }),
    }),

    // ==========================
    // Login
    // ==========================

    login: builder.mutation<IApiResponse<IUser>, LoginInput>({
      query: (body) => ({
        url: "/auth/login",
        method: "POST",
        body,
        credentials: "include",
      }),

      invalidatesTags: ["User", "Auth"],
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
    // Current User
    // ==========================

    me: builder.query<IApiResponse<IUser>, void>({
      query: () => ({
        url: "/auth/me",
        credentials: "include",
      }),

      providesTags: ["User"],
    }),

    // ==========================
    // Admin
    // ==========================

    isAdmin: builder.query<boolean, void>({
      query: () => ({
        url: "/users/is-admin",
      }),
    }),

    // ==========================
    // Update Profile
    // ==========================

    updateProfile: builder.mutation<IUser, UpdateProfileInput>({
      query: (body) => ({
        url: "/auth/profile",
        method: "PATCH",
        body,
      }),

      invalidatesTags: ["User"],
    }),

    // ==========================
    // Logout
    // ==========================

    logout: builder.mutation<{ message: string }, void>({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
        credentials: "include",
      }),

      invalidatesTags: ["User", "Auth"],
    }),

    // ==========================
    // Change Password
    // ==========================

    changePassword: builder.mutation<{ message: string }, ChangePasswordInput>({
      query: (body) => ({
        url: "/auth/change-password",
        method: "POST",
        body,
      }),
    }),
  }),

  overrideExisting: false,
})

export const {
  useRegisterMutation,
  useLoginMutation,
  useRefreshTokenMutation,
  useMeQuery,
  useIsAdminQuery,
  useUpdateProfileMutation,
  useLogoutMutation,
  useChangePasswordMutation,
} = authApi
