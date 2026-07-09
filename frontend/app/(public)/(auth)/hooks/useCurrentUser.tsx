import { useMeQuery } from "@/app/redux/api/authApi"
import { usePathname } from "next/navigation"

export const useCurrentUser = () => {
  
  const pathname = usePathname()
  const publicRoutes = ["/", "/login", "/register", "/forgot-password"]
  const skip = publicRoutes.includes(pathname)
  const { data, error, isLoading, refetch } = useMeQuery(undefined, {
    skip,
  })

  return {
    user: data?.data ?? null,
    isAuthenticated: !!data?.data,
    isLoading,
    error,
    refetch,
  }
}
