"use client"

import { useRouter } from "next/navigation"

import { useLogoutMutation } from "@/app/redux/api/authApi"
import { useAppDispatch } from "@/app/redux/hooks"

import { clearCredentials } from "@/app/redux/slices/authSlice"

export default function useLogout() {
  const router = useRouter()

  const dispatch = useAppDispatch()

  const [logout, { isLoading }] = useLogoutMutation()

  const handleLogout = async () => {
    try {
      await logout().unwrap()
    } catch (error) {
      console.error(error)
    } finally {
      dispatch(clearCredentials())

      router.replace("/login")

      router.refresh()
    }
  }

  return {
    logout: handleLogout,
    isLoading,
  }
}
