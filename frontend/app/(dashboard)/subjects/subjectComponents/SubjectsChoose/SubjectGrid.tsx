"use client"

import { ISubject } from "../../subjects.type"
import SubjectCard from "./SubjectCard"

import { useGetSubjectsQuery } from "@/app/redux/api/subjectsApi"

export default function SubjectGrid() {
  const { data, isLoading, isError, error } = useGetSubjectsQuery()

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <div
            key={index}
            className="h-32 animate-pulse rounded-xl border border-border bg-muted/40"
          />
        ))}
      </div>
    )
  }

  if (isError) {
    console.error(error)

    return (
      <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-6 text-center">
        <p className="text-sm font-medium text-destructive">
          বিষয়গুলো লোড করা যায়নি।
        </p>

        <p className="mt-1 text-xs text-muted-foreground">
          অনুগ্রহ করে কিছুক্ষণ পর আবার চেষ্টা করুন।
        </p>
      </div>
    )
  }

  const subjects = data?.data ?? []

  if (subjects.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-muted/30 p-8 text-center">
        <p className="text-sm font-medium text-foreground">
          কোনো বিষয় পাওয়া যায়নি।
        </p>

        <p className="mt-1 text-xs text-muted-foreground">
          পরে আবার চেষ্টা করুন।
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
      {subjects.map((subject: ISubject) => (
        <SubjectCard key={subject._id} subject={subject} />
      ))}
    </div>
  )
}
