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

const PUBLIC_ROUTES = ["/", "/login", "/register", "/forgot-password"]

export default function AuthProvider({ children }: Props) {
  const pathname = usePathname()
  const dispatch = useAppDispatch()

  const isPublicRoute = PUBLIC_ROUTES.includes(pathname)

  const { data, isLoading, isSuccess, isError } = useMeQuery(undefined, {
    skip: isPublicRoute,
  
  })

  useEffect(() => {
    if (isPublicRoute) {
      dispatch(clearCredentials())
      return
    }

    if (isLoading) {
      dispatch(setLoading(true))
      return
    }

    dispatch(setLoading(false))

    if (isSuccess && data?.data) {
      dispatch(setCredentials(data.data))
      return
    }

    if (isError) {
      dispatch(clearCredentials())
    }
  }, [isPublicRoute, isLoading, isSuccess, isError, data, dispatch])

  return <>{children}</>
}
