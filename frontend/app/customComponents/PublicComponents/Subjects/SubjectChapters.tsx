"use client"

import { useGetChaptersBySubjectQuery } from "@/app/redux/api/chaptersApi"
import { useGetSubjectQuery } from "@/app/redux/api/subjectsApi"

import ChapterCard from "./ChapterCard"
import ChapterCardSkeleton from "./ChapterCardSkeleton"

interface SubjectChaptersProps {
  subjectSlug: string
}

export default function SubjectChapters({ subjectSlug }: SubjectChaptersProps) {
  const {
    data: subjectResponse,
    isLoading: subjectLoading,
    isError: subjectError,
  } = useGetSubjectQuery(subjectSlug, {
    skip: !subjectSlug,
  })

  const subjectId = subjectResponse?.data?._id

  const {
    data: chaptersResponse,
    isLoading: chaptersLoading,
    isError: chaptersError,
  } = useGetChaptersBySubjectQuery(subjectId!, {
    skip: !subjectId,
  })

  /*
   * --------------------------------
   * Subject loading
   * --------------------------------
   */

  if (subjectLoading) {
    return (
      <section className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8 space-y-3">
          <div className="h-4 w-24 animate-pulse rounded bg-muted" />

          <div className="h-9 w-64 animate-pulse rounded-lg bg-muted" />

          <div className="h-5 w-full max-w-xl animate-pulse rounded bg-muted" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          {Array.from({ length: 8 }).map((_, index) => (
            <ChapterCardSkeleton key={index} />
          ))}
        </div>
      </section>
    )
  }

  /*
   * --------------------------------
   * Subject error
   * --------------------------------
   */

  if (subjectError || !subjectId) {
    return (
      <section className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="rounded-xl border border-dashed p-10 text-center">
          <h2 className="font-semibold">বিষয়টি পাওয়া যায়নি</h2>

          <p className="mt-2 text-sm text-muted-foreground">
            আপনি যে বিষয়টি খুঁজছেন সেটি পাওয়া যায়নি।
          </p>
        </div>
      </section>
    )
  }

  /*
   * --------------------------------
   * Chapters loading
   * --------------------------------
   */

  if (chaptersLoading) {
    return (
      <section className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8">
          <p className="mb-2 text-sm font-medium text-primary">অধ্যায়</p>

          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            {subjectResponse.data.title}
          </h1>

          <p className="mt-2 text-muted-foreground">
            একটি অধ্যায় বেছে নিয়ে তার টপিক ও প্রশ্ন দেখুন।
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {Array.from({ length: 8 }).map((_, index) => (
            <ChapterCardSkeleton key={index} />
          ))}
        </div>
      </section>
    )
  }

  /*
   * --------------------------------
   * Chapters error
   * --------------------------------
   */

  if (chaptersError) {
    return (
      <section className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="rounded-xl border border-dashed p-10 text-center">
          <h2 className="font-semibold">অধ্যায়গুলো লোড করা যায়নি</h2>

          <p className="mt-2 text-sm text-muted-foreground">
            কিছুক্ষণ পর আবার চেষ্টা করুন।
          </p>
        </div>
      </section>
    )
  }

  const chapters = chaptersResponse?.data ?? []

  /*
   * --------------------------------
   * Normal content
   * --------------------------------
   */

  return (
    <section className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8">
        <p className="mb-2 text-sm font-medium text-primary">অধ্যায়</p>

        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          {subjectResponse.data.title}
        </h1>

        <p className="mt-2 text-muted-foreground">
          একটি অধ্যায় বেছে নিয়ে তার টপিক ও প্রশ্ন দেখুন।
        </p>
      </div>

      {chapters.length === 0 ? (
        <div className="rounded-2xl border border-dashed p-10 text-center">
          <h2 className="font-semibold">এখনো কোনো অধ্যায় নেই</h2>

          <p className="mt-2 text-sm text-muted-foreground">
            এই বিষয়ের কোনো অধ্যায় এখনো যোগ করা হয়নি।
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {chapters.map((chapter) => (
            <ChapterCard key={chapter._id} chapter={chapter} />
          ))}
        </div>
      )}
    </section>
  )
}
