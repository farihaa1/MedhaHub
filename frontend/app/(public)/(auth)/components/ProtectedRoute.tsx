"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

import { useAppSelector } from "@/app/redux/hooks"

interface Props {
  children: React.ReactNode
}

export default function ProtectedRoute({ children }: Props) {
  const router = useRouter()

  const { user, isLoading } = useAppSelector((state) => state.auth)

  useEffect(() => {
    // Wait until AuthProvider finishes checking /auth/me
    if (isLoading) return

    // User is not authenticated
    if (!user) {
      router.replace("/login")
    }
  }, [user, isLoading, router])

  // Still checking authentication
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Loading...
      </div>
    )
  }

  // Prevent rendering protected content
  if (!user) {
    return null
  }

  return <>{children}</>
}
