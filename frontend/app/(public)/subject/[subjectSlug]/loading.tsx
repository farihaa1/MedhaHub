export default function Loading() {
  return (
    <main className="min-h-[70vh] bg-background">
      <section className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
        {/* Header skeleton */}
        <div className="mb-8 space-y-3">
          <div className="h-4 w-32 animate-pulse rounded bg-muted" />

          <div className="h-9 w-64 animate-pulse rounded-lg bg-muted" />

          <div className="h-5 w-full max-w-xl animate-pulse rounded bg-muted" />
        </div>

        {/* Chapter skeletons */}
        <div className="grid grid-cols-2 gap-3">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="rounded-sm border bg-card p-5">
              <div className="flex items-start justify-between">
                <div className="w-full space-y-3">
                  <div className="h-5 w-3/4 animate-pulse rounded bg-muted" />

                  <div className="h-4 w-40 animate-pulse rounded bg-muted" />
                </div>

                <div className="h-5 w-5 shrink-0 animate-pulse rounded bg-muted" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}
