"use client"

import { Skeleton } from "@/components/ui/skeleton"

export default function QuestionCardSkeleton() {
  return (
    <article className="overflow-hidden rounded-2xl border bg-card shadow-sm">
      {/* Header */}
      <div className="border-b bg-muted/30 px-8 py-5">
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-64" />
        </div>

        <div className="mt-4 flex gap-2">
          <Skeleton className="h-6 w-20 rounded-full" />
          <Skeleton className="h-6 w-24 rounded-full" />
          <Skeleton className="h-6 w-20 rounded-full" />
        </div>
      </div>

      {/* Body */}
      <div className="space-y-6 p-8">
        {/* Question */}
        <div className="space-y-3">
          <Skeleton className="h-7 w-full" />
          <Skeleton className="h-7 w-11/12" />
          <Skeleton className="h-7 w-9/12" />
        </div>

        {/* Image */}
        <Skeleton className="h-72 w-full rounded-xl" />

        {/* Options */}
        <div className="grid gap-4 md:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="rounded-xl border p-4">
              <div className="flex gap-3">
                <Skeleton className="h-7 w-7 rounded-full" />

                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-10/12" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Tags */}
        <div className="flex gap-2">
          <Skeleton className="h-7 w-16 rounded-full" />
          <Skeleton className="h-7 w-20 rounded-full" />
          <Skeleton className="h-7 w-14 rounded-full" />
        </div>

        {/* Button */}
        <Skeleton className="h-10 w-40 rounded-md" />

        {/* Explanation */}
        <div className="rounded-xl border p-6">
          <Skeleton className="h-6 w-36" />

          <div className="mt-4 space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-11/12" />
            <Skeleton className="h-4 w-10/12" />
            <Skeleton className="h-4 w-9/12" />
          </div>

          <Skeleton className="mt-6 h-56 w-full rounded-xl" />
        </div>
      </div>
    </article>
  )
}
