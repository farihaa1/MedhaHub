"use client"

import { Home, RefreshCw } from "lucide-react"
import { useRouter } from "next/navigation"

export default function Error({
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const router = useRouter()

  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="w-full max-w-md text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
          <RefreshCw className="h-5 w-5" />
        </div>

        <h1 className="mt-5 text-lg font-semibold">Unable to load results</h1>

        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Something went wrong while loading your examination result.
        </p>

        <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-xs font-medium text-primary-foreground"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Try Again
          </button>

          <button
            type="button"
            onClick={() => router.replace("/dashboard")}
            className="inline-flex items-center justify-center gap-2 rounded-lg border px-4 py-2.5 text-xs font-medium transition hover:bg-muted"
          >
            <Home className="h-3.5 w-3.5" />
            Dashboard
          </button>
        </div>
      </div>
    </div>
  )
}
