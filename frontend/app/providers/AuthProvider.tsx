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

const PUBLIC_ROUTES = [
  "/",
  "/login",
  "/register",
  "/forgot-password",
  "/questions",
  "/subjects",
]

export default function AuthProvider({ children }: Props) {
  const pathname = usePathname()

  const dispatch = useAppDispatch()

  const skip = PUBLIC_ROUTES.includes(pathname)

  const { data, isLoading, isSuccess, isError } = useMeQuery(undefined, {
    skip,
    refetchOnMountOrArgChange: true,
  })

  useEffect(() => {
    if (skip) {
      dispatch(setLoading(false))
      return
    }

    if (isLoading) {
      dispatch(setLoading(true))
      return
    }

    if (isSuccess && data?.data) {
      dispatch(setCredentials(data.data))
      return
    }

    if (isError) {
      dispatch(clearCredentials())
    }
  }, [skip, isLoading, isSuccess, isError, data, dispatch])

  return <>{children}</>
}
