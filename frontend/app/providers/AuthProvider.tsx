"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"

import { useMeQuery } from "@/app/redux/api/authApi"
import { useAppDispatch } from "@/app/redux/hooks"

import {
  clearCredentials,
  setAuthLoading,
  setCredentials,
} from "@/app/redux/slices/authSlice"

interface Props {
  children: React.ReactNode
}

export default function AuthProvider({ children }: Props) {
  const dispatch = useAppDispatch()
  const pathname = usePathname()

  const isPublicPage =
    pathname === "/login" ||
    pathname === "/register" ||
    pathname.startsWith("/login/google")

  const { data, isLoading, isError } = useMeQuery(undefined, {
    skip: isPublicPage,

    refetchOnMountOrArgChange: false,
    refetchOnFocus: false,
    refetchOnReconnect: false,
  })

  useEffect(() => {
    // Don't check /me on public auth pages
    if (isPublicPage) {
      dispatch(setAuthLoading(false))
      return
    }

    // Still checking authentication
    if (isLoading) {
      dispatch(setAuthLoading(true))
      return
    }

    // Successfully authenticated
    if (data?.data) {
      dispatch(setCredentials(data.data))
      return
    }

    // Not authenticated
    if (isError) {
      dispatch(clearCredentials())
    }
  }, [data, isError, isLoading, isPublicPage, dispatch])

  return <>{children}</>
}
