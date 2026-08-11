"use client"
import SubjectCard from "@/app/(dashboard)/subjects/subjectComponents/SubjectsChoose/SubjectCard"
import { useGetSubjectsQuery } from "@/app/redux/api/subjectsApi"

export default function SubjectsPage() {
  const { data, isLoading, isError } = useGetSubjectsQuery()

  const subjects = data?.data ?? []

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      {/* Header */}
      <section className="mb-6">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          বিষয়সমূহ
        </h1>

        <p className="mt-1 max-w-xl text-xs text-muted-foreground">
          আপনার পছন্দের বিষয় নির্বাচন করে প্রস্তুতি শুরু করুন।
        </p>
      </section>

      {/* Loading */}
      {isLoading && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {Array.from({ length: 8 }).map((_, index) => (
            <div
              key={index}
              className="h-32 animate-pulse rounded-xl border border-border bg-muted/40"
            />
          ))}
        </div>
      )}

      {/* Error */}
      {isError && !isLoading && (
        <div className="rounded-xl border border-border bg-card p-8 text-center">
          <h2 className="text-sm font-medium text-foreground">
            বিষয়গুলো লোড করা যায়নি
          </h2>

          <p className="mt-1 text-xs text-muted-foreground">
            অনুগ্রহ করে কিছুক্ষণ পর আবার চেষ্টা করুন।
          </p>
        </div>
      )}

      {/* Empty */}
      {!isLoading && !isError && subjects.length === 0 && (
        <div className="rounded-xl border border-dashed border-border bg-card p-8 text-center">
          <h2 className="text-sm font-medium text-foreground">
            কোনো বিষয় পাওয়া যায়নি
          </h2>

          <p className="mt-1 text-xs text-muted-foreground">
            নতুন বিষয় যোগ করা হলে এখানে দেখা যাবে।
          </p>
        </div>
      )}

      {/* Subjects */}
      {!isLoading && !isError && subjects.length > 0 && (
        <div className="grid grid-cols-2 gap-x-10 md:gap-x-20 gap-y-4">
          {subjects.map((subject) => (
            <SubjectCard key={subject._id} subject={subject} />
          ))}
        </div>
      )}
    </main>
  )
}
