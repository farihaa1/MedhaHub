"use client"

import { Skeleton } from "@/components/ui/skeleton"

export default function QuestionCardSkeleton() {
  return (
    <article className="overflow-hidden rounded-xl border bg-card">
      {/* Header */}
      <div className="border-b bg-muted/20 px-4 py-3 sm:px-5 sm:py-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1 space-y-2">
            <Skeleton className="h-3 w-16" />

            <Skeleton className="h-3 w-64 max-w-full" />
          </div>

          <div className="hidden shrink-0 gap-2 sm:flex">
            <Skeleton className="h-8 w-20 rounded-md" />
            <Skeleton className="h-8 w-16 rounded-md" />
          </div>
        </div>

        {/* Sources */}
        <div className="mt-3 flex flex-wrap gap-2">
          <Skeleton className="h-6 w-24 rounded-full" />
          <Skeleton className="h-6 w-28 rounded-full" />
          <Skeleton className="h-6 w-20 rounded-full" />
        </div>
      </div>

      {/* Body */}
      <div className="space-y-4 px-4 py-4 sm:px-5 sm:py-5">
        {/* Question */}
        <div className="space-y-2">
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-5 w-11/12" />
          <Skeleton className="h-5 w-8/12" />
        </div>

        {/* Question image */}
        <Skeleton className="h-48 w-full rounded-lg sm:h-64" />

        {/* Options */}
        <div className="grid gap-2.5 sm:grid-cols-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="rounded-lg border p-3">
              <div className="flex items-start gap-2.5">
                <Skeleton className="h-7 w-7 shrink-0 rounded-full" />

                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-8/12" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          <Skeleton className="h-5 w-14 rounded-full" />
          <Skeleton className="h-5 w-20 rounded-full" />
          <Skeleton className="h-5 w-16 rounded-full" />
        </div>

        {/* Answer button */}
        <Skeleton className="h-8 w-28 rounded-md" />
      </div>
    </article>
  )
}
