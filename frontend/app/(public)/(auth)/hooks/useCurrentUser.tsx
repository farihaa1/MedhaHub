"use client"

import { useEffect } from "react"

import { useMeQuery } from "@/app/redux/api/authApi"
import { useAppDispatch, useAppSelector } from "@/app/redux/hooks"

import { clearCredentials, setCredentials } from "@/app/redux/slices/authSlice"

export default function useCurrentUser() {
  const dispatch = useAppDispatch()

  const auth = useAppSelector((state) => state.auth)

  const { data, isLoading, isFetching, isError } = useMeQuery(undefined, {
    refetchOnMountOrArgChange: true,
    refetchOnReconnect: true,
    refetchOnFocus: true,
  })

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
