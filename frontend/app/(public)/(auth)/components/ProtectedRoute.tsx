"use client"

import { useAppSelector } from "@/app/redux/hooks"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()

  const { user, isLoading } = useAppSelector((state) => state.auth)

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/login")
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (!user) {
    return null
  }

  return children
}
