"use client"

import { AlertCircle, Home, RefreshCw } from "lucide-react"

import { useRouter } from "next/navigation"

export default function Error({
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const router = useRouter()

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md rounded-2xl border bg-card p-8 text-center shadow-sm">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10">
          <AlertCircle className="h-6 w-6 text-destructive" />
        </div>

        <h1 className="mt-5 text-lg font-semibold">Something went wrong</h1>

        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          We couldn&apos;t load your examination. Your exam data has not been
          deleted.
        </p>

        <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-xs font-medium text-primary-foreground transition hover:opacity-90"
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
    </main>
  )
}
