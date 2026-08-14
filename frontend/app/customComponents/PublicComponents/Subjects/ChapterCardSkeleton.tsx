"use client"

import { Skeleton } from "@/components/ui/skeleton"

export default function ChapterCardSkeleton() {
  return (
    <article className="rounded-sm border bg-card p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="w-full space-y-3">
          <Skeleton className="h-5 w-3/4" />

          <div className="flex items-center gap-2">
            <Skeleton className="h-3 w-3 rounded-full" />
            <Skeleton className="h-3 w-24" />

            <Skeleton className="h-3 w-3 rounded-full" />

            <Skeleton className="h-3 w-20" />
          </div>
        </div>

        <Skeleton className="mt-1 h-5 w-5 shrink-0" />
      </div>
    </article>
  )
}
