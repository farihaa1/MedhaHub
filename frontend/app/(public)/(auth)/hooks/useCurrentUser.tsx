"use client"

import { useEffect } from "react"

import { useMeQuery } from "@/app/redux/api/authApi"
import { useAppDispatch, useAppSelector } from "@/app/redux/hooks"
import { setCredentials, clearCredentials } from "@/app/redux/slices/authSlice"

export default function useCurrentUser() {
  const dispatch = useAppDispatch()

  const auth = useAppSelector((state) => state.auth)

  const { data, isLoading, isFetching, isError } = useMeQuery(undefined)

  useEffect(() => {
    if (data?.data) {
      dispatch(setCredentials(data.data))
    }

    if (isError) {
      dispatch(clearCredentials())
    }
  }, [data, isError, dispatch])

  return {
    user: auth.user,
    isAuthenticated: auth.isAuthenticated,
    isLoading: isLoading || isFetching,
  }
}
