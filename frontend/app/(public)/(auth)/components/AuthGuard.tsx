"use client"

import { useRouter } from "next/navigation"
import { useEffect } from "react"

import { useCurrentUser } from "../hooks/useCurrentUser"

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()

  const { isAuthenticated, isLoading } = useCurrentUser()

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace("/dashboard")
    }
  }, [isAuthenticated, isLoading, router])

  if (isLoading) return <div>Loading...</div>

  if (isAuthenticated) return null

  return <>{children}</>
}
