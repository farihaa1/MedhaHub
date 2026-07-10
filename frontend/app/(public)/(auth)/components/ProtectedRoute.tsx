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
    if (isLoading) return

    if (!user) {
      router.replace("/login")
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Loading...
      </div>
    )
  }

  if (!user) {
    return null
  }

  return <>{children}</>
}
