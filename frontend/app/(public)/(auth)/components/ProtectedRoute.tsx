"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

import { useAppSelector } from "@/app/redux/hooks"

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()

  const { user, isAuthenticated, isLoading } = useAppSelector(
    (state) => state.auth
  )

  useEffect(() => {
    if (isLoading) return

    if (!isAuthenticated || !user) {
      router.replace("/login")
    }
  }, [isLoading, isAuthenticated, user, router])

  // Authentication is being checked
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Checking authentication...
          </p>
        </div>
      </div>
    )
  }

  // Not authenticated
  if (!isAuthenticated || !user) {
    return null
  }

  // Authenticated
  return <>{children}</>
}
