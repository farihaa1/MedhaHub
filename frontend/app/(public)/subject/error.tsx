"use client"

import { AlertCircle, RefreshCw, ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function Error({ error, reset }: ErrorProps) {
  const router = useRouter()

  return (
    <main className="flex min-h-[70vh] items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl border bg-card p-8 text-center shadow-sm">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10">
          <AlertCircle className="h-7 w-7 text-destructive" />
        </div>

        <h1 className="mt-5 text-2xl font-bold">Failed to load subject</h1>

        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          We couldn&apos;t load the chapters for this subject.
        </p>

        {process.env.NODE_ENV === "development" && (
          <p className="mt-4 rounded-lg bg-muted p-3 text-left text-xs break-words text-muted-foreground">
            {error?.message || "Unknown error"}
          </p>
        )}

        <div className="mt-6 flex justify-center gap-3">
          <button
            onClick={reset}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 font-medium text-primary-foreground"
          >
            <RefreshCw className="h-4 w-4" />
            Retry
          </button>

          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 rounded-xl border px-5 py-2.5 font-medium hover:bg-muted"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>
        </div>
      </div>
    </main>
  )
}
