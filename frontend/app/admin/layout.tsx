"use client"

import ProtectedRoute from "../(public)/(auth)/components/ProtectedRoute"
import RoleGuard from "../(public)/(auth)/components/RoleGurd"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ProtectedRoute>
      <RoleGuard allowedRoles={["ADMIN"]}>{children}</RoleGuard>
    </ProtectedRoute>
  )
}
