import { baseApi } from "./baseApi"

import { IApiResponse, IUser, UpdateUserInput } from "../types/auth.type"

// ============================================================
// USER API
// ============================================================

export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ========================================================
    // GET ALL USERS
    // GET /users
    // ========================================================

    getUsers: builder.query<IApiResponse<IUser[]>, void>({
      query: () => ({
        url: "/users",
        method: "GET",
        credentials: "include",
      }),

      providesTags: (result) => {
        if (!result?.data) {
          return ["User"]
        }

        return [
          "User",

          ...result.data.map((user) => ({
            type: "User" as const,
            id: user._id,
          })),
        ]
      },
    }),

    // ========================================================
    // GET SINGLE USER
    // GET /users/:id
    // ========================================================

    getUser: builder.query<IApiResponse<IUser>, string>({
      query: (id) => ({
        url: `/users/${id}`,
        method: "GET",
        credentials: "include",
      }),

      providesTags: (_result, _error, id) => [
        {
          type: "User",
          id,
        },
      ],
    }),

    // ========================================================
    // UPDATE USER
    // PATCH /users/:id
    // ========================================================

    updateUser: builder.mutation<
      IApiResponse<IUser>,
      {
        id: string
        data: UpdateUserInput
      }
    >({
      query: ({ id, data }) => ({
        url: `/users/${id}`,
        method: "PATCH",
        body: data,
        credentials: "include",
      }),

      invalidatesTags: (_result, _error, { id }) => [
        {
          type: "User",
          id,
        },
        "User",
      ],
    }),
  }),

  overrideExisting: false,
})

// ============================================================
// GENERATED HOOKS
// ============================================================

export const { useGetUsersQuery, useGetUserQuery, useUpdateUserMutation } =
  userApi
