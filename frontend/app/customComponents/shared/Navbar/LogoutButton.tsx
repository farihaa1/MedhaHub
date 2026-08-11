"use client"

import { Loader2, LogOut } from "lucide-react"
import { useRouter } from "next/navigation"

import { useLogoutMutation } from "@/app/redux/api/authApi"
import { baseApi } from "@/app/redux/api/baseApi"
import { useAppDispatch } from "@/app/redux/hooks"
import { clearCredentials } from "@/app/redux/slices/authSlice"

type Props = {
  className?: string
}

export default function LogoutButton({ className }: Props) {
  const router = useRouter()
  const dispatch = useAppDispatch()

  const [logout, { isLoading }] = useLogoutMutation()

  const handleLogout = async () => {
    try {
      await logout().unwrap()
    } catch (error) {
      console.error("Logout failed:", error)
    } finally {
      /*
       * Clear immediately on client.
       *
       * authApi.onQueryStarted also does this,
       * but keeping this here guarantees the UI is cleared
       * even if the request fails.
       */
      dispatch(clearCredentials())

      dispatch(baseApi.util.resetApiState())

      router.replace("/login")
      router.refresh()
    }
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={isLoading}
      className={className}
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 size-4 animate-spin" />
          Logging out...
        </>
      ) : (
        <>
          <h1 className="flex">
           
            <LogOut className="mr-2 size-4" />
            <p> Logout</p>
          </h1>
        </>
      )}
    </button>
  )
}
