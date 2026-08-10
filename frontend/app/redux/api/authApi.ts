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

import {
  clearCredentials,
  setAuthLoading,
  setCredentials,
} from "../slices/authSlice"

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // =========================================================
    // REGISTER
    // =========================================================

    register: builder.mutation<AuthResponse, RegisterInput>({
      query: (body) => ({
        url: "/auth/register",
        method: "POST",
        body,
        credentials: "include",
      }),

      invalidatesTags: ["User", "Auth"],

      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        dispatch(setAuthLoading(true))

        try {
          const { data } = await queryFulfilled

          if (data?.data) {
            dispatch(setCredentials(data.data))
          } else {
            dispatch(clearCredentials())
          }
        } catch {
          dispatch(clearCredentials())
        }
      },
    }),

    // =========================================================
    // LOGIN
    // =========================================================

    login: builder.mutation<AuthResponse, LoginInput>({
      query: (body) => ({
        url: "/auth/login",
        method: "POST",
        body,
        credentials: "include",
      }),

      invalidatesTags: ["User", "Auth"],

      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        dispatch(setAuthLoading(true))

        try {
          const { data } = await queryFulfilled

          if (data?.data) {
            dispatch(setCredentials(data.data))
          } else {
            dispatch(clearCredentials())
          }
        } catch {
          dispatch(clearCredentials())
        }
      },
    }),

    // =========================================================
    // CURRENT USER
    // =========================================================

    me: builder.query<IApiResponse<IUser>, void>({
      query: () => ({
        url: "/auth/me",
        method: "GET",
        credentials: "include",
      }),

      providesTags: ["User"],

      keepUnusedDataFor: 300,

      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        dispatch(setAuthLoading(true))

        try {
          const { data } = await queryFulfilled

          if (data?.data) {
            dispatch(setCredentials(data.data))
          } else {
            dispatch(clearCredentials())
          }
        } catch {
          dispatch(clearCredentials())
        }
      },
    }),

    // =========================================================
    // REFRESH TOKEN
    // =========================================================

    refreshToken: builder.mutation<AuthResponse, void>({
      query: () => ({
        url: "/auth/refresh-token",
        method: "POST",
        credentials: "include",
      }),

      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled

          if (data?.data) {
            dispatch(setCredentials(data.data))
          }
        } catch {
          dispatch(clearCredentials())
        }
      },
    }),

    // =========================================================
    // LOGOUT
    // =========================================================

    logout: builder.mutation<IApiResponse<null>, void>({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
        credentials: "include",
      }),

      invalidatesTags: ["User", "Auth"],

      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled
        } finally {
          dispatch(clearCredentials())
        }
      },
    }),

    // =========================================================
    // UPDATE PROFILE
    // =========================================================

    updateProfile: builder.mutation<IApiResponse<IUser>, UpdateProfileInput>({
      query: (body) => ({
        url: "/auth/profile",
        method: "PATCH",
        body,
        credentials: "include",
      }),

      invalidatesTags: ["User"],

      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled

          if (data?.data) {
            dispatch(setCredentials(data.data))
          }
        } catch {
          // Keep existing auth state if profile update fails.
        }
      },
    }),

    // =========================================================
    // CHANGE PASSWORD
    // =========================================================

    changePassword: builder.mutation<IApiResponse<null>, ChangePasswordInput>({
      query: (body) => ({
        url: "/auth/change-password",
        method: "POST",
        body,
        credentials: "include",
      }),
    }),

    // =========================================================
    // IS ADMIN
    // =========================================================

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
  useMeQuery,
  useRefreshTokenMutation,
  useLogoutMutation,
  useUpdateProfileMutation,
  useChangePasswordMutation,
  useIsAdminQuery,
} = authApi
