"use client"

import { ReactNode, useEffect } from "react"
import { usePathname } from "next/navigation"

import { useMeQuery } from "@/app/redux/api/authApi"
import { useAppDispatch } from "@/app/redux/hooks"

import {
  clearCredentials,
  setCredentials,
  setLoading,
} from "@/app/redux/slices/authSlice"

interface Props {
  children: ReactNode
}

const AUTH_ROUTES = [
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
]

export default function AuthProvider({ children }: Props) {
  const pathname = usePathname()
  const dispatch = useAppDispatch()

  const skip = AUTH_ROUTES.some((route) => pathname.startsWith(route))

  const { data, isLoading, isError } = useMeQuery(undefined, {
    skip,
  })

  useEffect(() => {
    if (skip) {
      dispatch(setLoading(false))
      return
    }

    dispatch(setLoading(isLoading))

    if (data?.data) {
      dispatch(setCredentials(data.data))
      return
    }

    if (!isLoading && isError) {
      dispatch(clearCredentials())
    }
  }, [skip, isLoading, isError, data, dispatch])

  return <>{children}</>
}
