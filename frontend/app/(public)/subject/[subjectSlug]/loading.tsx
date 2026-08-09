export default function Loading() {
  return (
    <main className="min-h-[70vh] bg-background">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Subject header */}
        <div className="mb-8 space-y-3">
          <div className="h-9 w-72 animate-pulse rounded-lg bg-muted" />

          <div className="h-5 w-96 max-w-full animate-pulse rounded bg-muted" />
        </div>

        {/* Chapters */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="rounded-2xl border bg-card p-6 shadow-sm"
            >
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 animate-pulse rounded-xl bg-muted" />

                <div className="flex-1 space-y-2">
                  <div className="h-5 w-3/4 animate-pulse rounded bg-muted" />
                  <div className="h-4 w-1/2 animate-pulse rounded bg-muted" />
                </div>
              </div>

              <div className="mt-6 h-2 w-full animate-pulse rounded-full bg-muted" />

              <div className="mt-4 flex justify-between">
                <div className="h-4 w-20 animate-pulse rounded bg-muted" />
                <div className="h-4 w-16 animate-pulse rounded bg-muted" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
