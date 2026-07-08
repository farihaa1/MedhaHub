"use client"

import { useRouter } from "next/navigation"
import { useEffect } from "react"

import { useCurrentUser } from "../hooks/useCurrentUser"

interface Props {
  children: React.ReactNode
  allowedRoles: string[]
}

export default function RoleGuard({ children, allowedRoles }: Props) {
  const router = useRouter()

  const { user, isLoading } = useCurrentUser()

  useEffect(() => {
    if (!isLoading && user && !allowedRoles.includes(user.role)) {
      router.replace("/403")
    }
  }, [user, isLoading, allowedRoles, router])

  if (isLoading) return <div>Loading...</div>

  if (!user || !allowedRoles.includes(user.role)) {
    return null
  }

  return <>{children}</>
}
