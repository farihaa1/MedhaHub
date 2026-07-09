"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

import { useCurrentUser } from "../hooks/useCurrentUser"

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()

  const { isAuthenticated, isLoading } = useCurrentUser()

  useEffect(() => {
    if (isLoading) return

    if (isAuthenticated) {
      router.replace("/dashboard")
    }
  }, [isAuthenticated, isLoading, router])

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Loading...
      </div>
    )
  }

  if (isAuthenticated) {
    return null
  }

  return <>{children}</>
}
