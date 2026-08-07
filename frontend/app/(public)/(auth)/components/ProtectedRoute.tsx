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

   if (isLoading) {
     return (
       <div className="flex min-h-screen items-center justify-center">
         <div className="space-y-4 text-center">
           <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
           <p className="text-sm text-muted-foreground">
             Checking authentication...
           </p>
         </div>
       </div>
     )
   }


  if (!isAuthenticated) {
    return null
  }

  return <>{children}</>
}
