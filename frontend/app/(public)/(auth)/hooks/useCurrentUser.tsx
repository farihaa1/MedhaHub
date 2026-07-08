import { useMeQuery } from "@/app/redux/api/authApi"

export const useCurrentUser = () => {
  const query = useMeQuery()

  return {
    ...query,
    user: query.data?.data ?? null,
    isAuthenticated: !!query.data?.data,
  }
}
