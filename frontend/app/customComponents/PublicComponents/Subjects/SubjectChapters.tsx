"use client"

import { useGetChaptersBySubjectQuery } from "@/app/redux/api/chaptersApi"

import { useGetSubjectQuery } from "@/app/redux/api/subjectsApi"

import ChapterCard from "./ChapterCard"

interface SubjectChaptersProps {
  subjectSlug: string
}

export default function SubjectChapters({ subjectSlug }: SubjectChaptersProps) {
  const {
    data: subjectResponse,
    isLoading: subjectLoading,
    isError: subjectError,
  } = useGetSubjectQuery(subjectSlug)

  const subjectId = subjectResponse?.data?._id

  const {
    data: chaptersResponse,
    isLoading: chaptersLoading,
    isError: chaptersError,
  } = useGetChaptersBySubjectQuery(subjectId!, {
    skip: !subjectId,
  })

  // Subject loading
  if (subjectLoading) {
    return (
      <section className="container mx-auto px-4 py-12">
        <p>Loading subject...</p>
      </section>
    )
  }

  // Subject error
  if (subjectError || !subjectId) {
    return (
      <section className="container mx-auto px-4 py-12">
        <p>Subject not found.</p>
      </section>
    )
  }

  // Chapter loading
  if (chaptersLoading) {
    return (
      <section className="container mx-auto px-4 py-12">
        <p>Loading chapters...</p>
      </section>
    )
  }

  // Chapter error
  if (chaptersError) {
    return (
      <section className="container mx-auto px-4 py-12">
        <p>Failed to load chapters.</p>
      </section>
    )
  }

  const chapters = chaptersResponse?.data ?? []

  return (
    <section className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <p className="mb-2 text-sm font-medium text-primary">
          Subject Chapters
        </p>

        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          {subjectResponse?.data?.title}
        </h1>

        <p className="mt-2 text-muted-foreground">
          Select a chapter to explore its topics and questions.
        </p>
      </div>

      {/* Empty */}
      {chapters.length === 0 ? (
        <div className="rounded-2xl border border-dashed p-10 text-center">
          <h2 className="font-semibold">No chapters available</h2>

          <p className="mt-2 text-sm text-muted-foreground">
            This subject does not have any chapters yet.
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
