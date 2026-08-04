
import { IUser, UpdateUserInput } from "@/app/features/auth/auth.type"
import { baseApi } from "./baseApi"

export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    /**
     * Get all users
     * GET /users
     */
    getUsers: builder.query<IUser[], void>({
      query: () => ({
        url: "/users",
        method: "GET",
      }),
      providesTags: ["User"],
    }),

    /**
     * Get single user
     * GET /users/:id
     */
    getUser: builder.query<IUser, string>({
      query: (id) => ({
        url: `/users/${id}`,
        method: "GET",
      }),
      providesTags: (_result, _error, id) => [{ type: "User", id }],
    }),

    /**
     * Update user
     * PATCH /users/:id
     */
    updateUser: builder.mutation<
     IUser,
      {
        id: string
        data: UpdateUserInput
      } >({
      query: ({ id, data }) => ({
        url: `/users/${id}`,
        method: "PATCH",
        body: data,
      }),

      invalidatesTags: (_result, _error, { id }) => [
        { type: "User", id },
        "User",
      ],
    }),
  }),

  overrideExisting: false,
})

export const { useGetUsersQuery, useGetUserQuery, useUpdateUserMutation } =
  userApi
