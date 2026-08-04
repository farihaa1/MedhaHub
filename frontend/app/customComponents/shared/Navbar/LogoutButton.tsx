"use client"

import { LogOut, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"

import { useLogoutMutation } from "@/app/redux/api/authApi"
import { baseApi } from "@/app/redux/api/baseApi"
import { useAppDispatch } from "@/app/redux/hooks"
import { clearCredentials } from "@/app/redux/slices/authSlice"

export default function LogoutButton() {
  const router = useRouter()

  const dispatch = useAppDispatch()

  const [logout, { isLoading }] = useLogoutMutation()

  const handleLogout = async () => {
    try {
      await logout().unwrap()
    } catch (error) {
      console.error(error)
    } finally {
      // Clear redux auth state
      dispatch(clearCredentials())

      // Clear every RTK Query cache
      dispatch(baseApi.util.resetApiState())

      // Redirect
      router.replace("/login")

      // Refresh App Router
      router.refresh()
    }
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleLogout}
      disabled={isLoading}
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Logging out...
        </>
      ) : (
        <>
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </>
      )}
    </Button>
  )
}
