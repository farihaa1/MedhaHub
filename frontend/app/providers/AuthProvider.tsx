"use client"

import { ReactNode, useEffect } from "react"

import { useMeQuery } from "@/app/redux/api/authApi"
import { useAppDispatch } from "@/app/redux/hooks"

import {
  setCredentials,
  clearCredentials,
  setLoading,
} from "@/app/redux/slices/authSlice"

export default function AuthProvider({ children }: { children: ReactNode }) {
  const dispatch = useAppDispatch()

  const { data, isLoading, isSuccess, isError } = useMeQuery()

  useEffect(() => {
    dispatch(setLoading(isLoading))

    if (isSuccess && data?.data) {
      dispatch(setCredentials(data.data))
    }

    if (isError) {
      dispatch(clearCredentials())
    }
  }, [isLoading, isSuccess, isError, data, dispatch])

  return children
}
