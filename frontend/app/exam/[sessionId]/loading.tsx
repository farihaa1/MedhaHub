// app/exam/[sessionId]/loading.tsx

export default function Loading() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm rounded-2xl border bg-card p-8 text-center shadow-sm">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>

        <h2 className="mt-5 text-base font-semibold">Loading examination</h2>

        <p className="mt-2 text-xs text-muted-foreground">
          Preparing your questions and timer...
        </p>

        <div className="mx-auto mt-5 h-1.5 w-40 overflow-hidden rounded-full bg-muted">
          <div className="h-full w-1/2 animate-pulse rounded-full bg-primary" />
        </div>
      </div>
    </main>
  )
}
