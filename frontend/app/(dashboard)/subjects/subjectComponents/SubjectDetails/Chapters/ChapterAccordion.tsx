"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"

import { IChapter } from "@/app/redux/api/chaptersApi"
import { useGetTopicsByChapterQuery } from "@/app/redux/api/topicsApi"

import ChapterCard from "./ChapterCard"

interface Props {
  chapters: IChapter[]
  selectedTopics: string[]
  onToggleTopic: (id: string) => void
}

export default function ChapterAccordion({
  chapters,
  selectedTopics,
  onToggleTopic,
}: Props) {
  const [openChapter, setOpenChapter] = useState<string | null>(
    chapters[0]?._id ?? null
  )

  if (chapters.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border bg-card p-8 text-center">
        <p className="text-sm font-medium text-foreground">
          কোনো অধ্যায় পাওয়া যায়নি।
        </p>

        <p className="mt-1 text-xs text-muted-foreground">
          এই বিষয়ের অধ্যায়গুলো পরে যোগ করা হবে।
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {chapters.map((chapter, index) => (
        <ChapterItem
          key={chapter._id}
          chapter={chapter}
          index={index}
          open={openChapter === chapter._id}
          onOpen={() =>
            setOpenChapter((previous) =>
              previous === chapter._id ? null : chapter._id
            )
          }
          selectedTopics={selectedTopics}
          onToggleTopic={onToggleTopic}
        />
      ))}
    </div>
  )
}

// ============================================================
// CHAPTER ITEM
// ============================================================

interface ChapterItemProps {
  chapter: IChapter
  index: number
  open: boolean
  onOpen: () => void
  selectedTopics: string[]
  onToggleTopic: (id: string) => void
}

function ChapterItem({
  chapter,
  index,
  open,
  onOpen,
  selectedTopics,
  onToggleTopic,
}: ChapterItemProps) {
  const { data, isLoading } = useGetTopicsByChapterQuery(chapter._id, {
    skip: !open,
  })

  const topics = data?.data ?? []

  const selectedCount = topics.filter((topic) =>
    selectedTopics.includes(topic._id)
  ).length

  const progress = Math.min(100, Math.max(0, chapter.progress ?? 0))

  return (
    <div
      className={`overflow-hidden rounded-xl border border-border bg-card transition-shadow ${
        open ? "shadow-sm" : ""
      }`}
    >
      {/* =====================================================
          HEADER
      ===================================================== */}

      <button
        type="button"
        onClick={onOpen}
        className="flex w-full items-center gap-3 p-4 text-left transition-colors hover:bg-muted/40"
      >
        {/* Chapter number */}

        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted text-xs font-semibold text-foreground">
          {index + 1}
        </div>

        {/* Chapter information */}

        <div className="min-w-0 flex-1">
          <p className="text-[10px] text-muted-foreground">
            অধ্যায় {index + 1}
          </p>

          <h3 className="mt-0.5 truncate text-sm font-semibold text-foreground">
            {chapter.title}
          </h3>

          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] text-muted-foreground">
            <span>{topics.length}টি টপিক</span>

            <span>{chapter.totalQuestions}টি প্রশ্ন</span>

            {selectedCount > 0 && (
              <span className="font-medium text-foreground">
                {selectedCount}টি নির্বাচিত
              </span>
            )}
          </div>

          {/* Progress */}

          <div className="mt-2 flex items-center gap-2">
            <div className="h-1 flex-1 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-foreground/70 transition-all"
                style={{
                  width: `${progress}%`,
                }}
              />
            </div>

            <span className="text-[10px] font-medium text-muted-foreground">
              {progress}%
            </span>
          </div>
        </div>

        {/* Chevron */}

        <ChevronDown
          className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* =====================================================
          TOPICS
      ===================================================== */}

      {open && (
        <div className="border-t border-border bg-muted/20 p-3 sm:p-4">
          {isLoading ? (
            <div className="space-y-2">
              <div className="h-16 animate-pulse rounded-lg bg-muted" />
              <div className="h-16 animate-pulse rounded-lg bg-muted" />
            </div>
          ) : topics.length === 0 ? (
            <div className="rounded-lg border border-dashed border-border bg-card p-6 text-center">
              <p className="text-xs text-muted-foreground">
                এই অধ্যায়ে কোনো টপিক পাওয়া যায়নি।
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {topics.map((topic) => (
                <ChapterCard
                  key={topic._id}
                  topic={topic}
                  selected={selectedTopics.includes(topic._id)}
                  onToggle={onToggleTopic}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
