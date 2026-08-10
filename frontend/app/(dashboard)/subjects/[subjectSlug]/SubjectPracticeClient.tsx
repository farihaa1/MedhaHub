"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

import SubjectDetailsHero from "../subjectComponents/SubjectDetails/SubjectDetailsHero"
import ChapterAccordion from "../subjectComponents/SubjectDetails/Chapters/ChapterAccordion"
import SelectedTopicsSummary from "../subjectComponents/SubjectDetails/Topics/SelectedTopicsSummary"

import { useGetSubjectQuery } from "@/app/redux/api/subjectsApi"
import { useGetChaptersBySubjectQuery } from "@/app/redux/api/chaptersApi"

interface Props {
  subjectSlug: string
}

export default function SubjectPracticeClient({ subjectSlug }: Props) {
  const router = useRouter()

  // ============================================================
  // SUBJECT
  // ============================================================

  const {
    data: subjectResponse,
    isLoading: subjectLoading,
    isError: subjectError,
  } = useGetSubjectQuery(subjectSlug)

  const subject = subjectResponse?.data

  // ============================================================
  // CHAPTERS
  // ============================================================

  const {
    data: chaptersResponse,
    isLoading: chaptersLoading,
    isError: chaptersError,
  } = useGetChaptersBySubjectQuery(subject?._id ?? "", {
    skip: !subject?._id,
  })

  const chapters = chaptersResponse?.data ?? []

  // ============================================================
  // SELECTED TOPICS
  // ============================================================

  const [selectedTopics, setSelectedTopics] = useState<string[]>([])

  const toggleTopic = (topicId: string) => {
    setSelectedTopics((previous) =>
      previous.includes(topicId)
        ? previous.filter((id) => id !== topicId)
        : [...previous, topicId]
    )
  }

  // ============================================================
  // LOADING
  // ============================================================

  if (subjectLoading || chaptersLoading) {
    return (
      <main className="mx-auto w-full max-w-6xl p-4 sm:p-6">
        <div className="space-y-5">
          {/* Hero skeleton */}

          <div className="space-y-4 rounded-2xl border bg-card p-5">
            <div className="h-4 w-20 animate-pulse rounded bg-muted" />

            <div className="h-8 w-48 animate-pulse rounded bg-muted" />

            <div className="h-4 w-full max-w-xl animate-pulse rounded bg-muted" />

            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              <div className="h-16 animate-pulse rounded-xl bg-muted" />
              <div className="h-16 animate-pulse rounded-xl bg-muted" />
              <div className="h-16 animate-pulse rounded-xl bg-muted" />
              <div className="h-16 animate-pulse rounded-xl bg-muted" />
            </div>
          </div>

          {/* Chapter skeletons */}

          <div className="space-y-3">
            <div className="h-5 w-28 animate-pulse rounded bg-muted" />

            <div className="h-20 animate-pulse rounded-xl bg-muted" />
            <div className="h-20 animate-pulse rounded-xl bg-muted" />
            <div className="h-20 animate-pulse rounded-xl bg-muted" />
          </div>
        </div>
      </main>
    )
  }

  // ============================================================
  // ERROR
  // ============================================================

  if (subjectError || chaptersError || !subject) {
    return (
      <main className="mx-auto w-full max-w-6xl p-4 sm:p-6">
        <div className="rounded-2xl border bg-card p-8 text-center">
          <h2 className="text-base font-semibold text-foreground">
            বিষয়টি লোড করা যায়নি
          </h2>

          <p className="mt-2 text-xs text-muted-foreground">
            বিষয়টির তথ্য পাওয়া যায়নি। অনুগ্রহ করে আবার চেষ্টা করুন।
          </p>
        </div>
      </main>
    )
  }

  // ============================================================
  // MAIN
  // ============================================================

  return (
    <main className="mx-auto w-full max-w-6xl space-y-7 p-4 pb-24 sm:p-6 sm:pb-28">
      {/* ========================================================
          SUBJECT OVERVIEW
      ======================================================== */}

      <SubjectDetailsHero
        title={subject.title}
        description={subject.description ?? ""}
        totalQuestions={subject.totalQuestions ?? 0}
        totalChapters={subject.totalChapters ?? 0}
        totalTopics={subject.totalTopics ?? 0}
        completedQuestions={subject.completedQuestions ?? 0}
        estimatedHours={subject.estimatedHours ?? 0}
      />

      {/* ========================================================
          CHAPTERS
      ======================================================== */}

      <section>
        <div className="mb-3">
          <h2 className="text-base font-semibold text-foreground">
            অধ্যায়সমূহ
          </h2>

          <p className="mt-1 text-xs text-muted-foreground">
            অধ্যায় খুলে আপনার পছন্দের টপিক নির্বাচন করুন।
          </p>
        </div>

        {chapters.length === 0 ? (
          <div className="rounded-xl border border-dashed bg-card p-8 text-center">
            <p className="text-sm font-medium text-foreground">
              কোনো অধ্যায় পাওয়া যায়নি
            </p>

            <p className="mt-1 text-xs text-muted-foreground">
              এই বিষয়ের জন্য এখনো কোনো অধ্যায় যোগ করা হয়নি।
            </p>
          </div>
        ) : (
          <ChapterAccordion
            chapters={chapters}
            selectedTopics={selectedTopics}
            onToggleTopic={toggleTopic}
          />
        )}
      </section>

      {/* ========================================================
          SELECTED TOPICS ACTION
      ======================================================== */}

      {selectedTopics.length > 0 && (
        <div className="fixed right-4 bottom-4 z-50 sm:right-6 sm:bottom-6">
          <SelectedTopicsSummary
            selectedTopics={selectedTopics.length}
            selectedQuestions={0}
            onGenerate={() => {
              router.push(`/configure?topics=${selectedTopics.join(",")}`)
            }}
          />
        </div>
      )}
    </main>
  )
}
