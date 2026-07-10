"use client"

import { useRouter } from "next/navigation"
import { useLogoutMutation } from "@/app/redux/api/authApi"
import { useAppDispatch } from "@/app/redux/hooks"
import { clearCredentials } from "@/app/redux/slices/authSlice"


export default function LogoutButton() {
  const [logout, { isLoading }] = useLogoutMutation()
  const dispatch = useAppDispatch()
  const router = useRouter()

  const handleLogout = async () => {
    await logout().unwrap()
    dispatch(clearCredentials())

    router.replace("/login")
    router.refresh()
  }
  return (
    <button onClick={handleLogout} disabled={isLoading}>
      {isLoading ? "Logging out..." : "Logout"}
    </button>
  )
}
