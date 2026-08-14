"use client"

import { Skeleton } from "@/components/ui/skeleton"

export default function TopicCardSkeleton() {
  return (
    <article className="rounded-sm border bg-card p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="w-full space-y-3">
          {/* Topic title */}
          <Skeleton className="h-5 w-3/4" />

          {/* Question count */}
          <div className="flex items-center gap-2">
            <Skeleton className="h-3 w-3 rounded-full" />
            <Skeleton className="h-3 w-28" />
          </div>
        </div>

        {/* Arrow */}
        <Skeleton className="mt-1 h-4 w-4 shrink-0 rounded" />
      </div>
    </article>
  )
}
