export default function Loading() {
  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-7 sm:px-6 lg:px-8">
        {/* Topic Header Skeleton */}
        <div className="mb-8 rounded-xl border bg-card p-6 md:px-10">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div className="w-full space-y-4">
              {/* Title */}
              <div className="flex items-center gap-2">
                <div className="h-6 w-6 animate-pulse rounded bg-muted" />

                <div className="h-8 w-64 max-w-full animate-pulse rounded bg-muted" />
              </div>

              {/* Question count */}
              <div className="h-4 w-36 animate-pulse rounded bg-muted" />

              {/* Description */}
              <div className="space-y-2">
                <div className="h-4 w-full max-w-2xl animate-pulse rounded bg-muted" />

                <div className="h-4 w-3/4 max-w-xl animate-pulse rounded bg-muted" />
              </div>
            </div>

            {/* Exam button */}
            <div className="h-10 w-28 shrink-0 animate-pulse rounded-md bg-muted" />
          </div>
        </div>

        {/* Question Skeletons */}
        <div className="space-y-5 px-0 md:px-8 lg:px-16">
          {Array.from({ length: 5 }).map((_, index) => (
            <QuestionSkeleton key={index} />
          ))}
        </div>
      </div>
    </main>
  )
}

function QuestionSkeleton() {
  return (
    <article className="overflow-hidden rounded-xl border bg-card">
      {/* Header */}
      <div className="border-b bg-muted/20 px-4 py-3 sm:px-5 sm:py-4">
        <div className="space-y-2">
          {/* Question number */}
          <div className="h-3 w-16 animate-pulse rounded bg-muted" />

          {/* Breadcrumb */}
          <div className="h-3 w-64 max-w-full animate-pulse rounded bg-muted" />
        </div>

        {/* Sources */}
        <div className="mt-3 flex flex-wrap gap-2">
          <div className="h-6 w-24 animate-pulse rounded-full bg-muted" />
          <div className="h-6 w-28 animate-pulse rounded-full bg-muted" />
          <div className="h-6 w-20 animate-pulse rounded-full bg-muted" />
        </div>
      </div>

      {/* Body */}
      <div className="space-y-5 px-4 py-4 sm:px-5 sm:py-5">
        {/* Question text */}
        <div className="space-y-2">
          <div className="h-5 w-full animate-pulse rounded bg-muted" />

          <div className="h-5 w-11/12 animate-pulse rounded bg-muted" />

          <div className="h-5 w-8/12 animate-pulse rounded bg-muted" />
        </div>

        {/* Question image */}
        <div className="h-48 w-full animate-pulse rounded-lg bg-muted sm:h-64" />

        {/* Options */}
        <div className="grid gap-2.5 sm:grid-cols-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="rounded-lg border p-3">
              <div className="flex items-start gap-2.5">
                {/* Option label */}
                <div className="h-7 w-7 shrink-0 animate-pulse rounded-full bg-muted" />

                {/* Option text */}
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-full animate-pulse rounded bg-muted" />

                  <div className="h-4 w-8/12 animate-pulse rounded bg-muted" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          <div className="h-5 w-14 animate-pulse rounded-full bg-muted" />

          <div className="h-5 w-20 animate-pulse rounded-full bg-muted" />

          <div className="h-5 w-16 animate-pulse rounded-full bg-muted" />
        </div>

        {/* Answer button */}
        <div className="h-8 w-28 animate-pulse rounded-md bg-muted" />
      </div>
    </article>
  )
}
