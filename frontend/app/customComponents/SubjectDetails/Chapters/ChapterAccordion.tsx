
"use client"

import { useState } from "react"
import {
  ChevronDown,
  BookOpen,
  FileQuestion,
  CheckCircle2,
} from "lucide-react"

import ChapterCard from "./ChapterCard"

import { Chapter, color } from "@/app/type"
import { topics } from "@/app/data/topicsData"
import { getTheme } from "@/app/data/colorPalete"

interface Props {
  chapters: Chapter[]
  color: color
  id: string

  // NEW
  selectedTopics: string[]
  onToggleTopic: (id: string) => void
}

export default function ChapterAccordion({
  chapters,
  color,
  id,
  selectedTopics,
  onToggleTopic,
}: Props) {
  const theme = getTheme(color.name)

  const [openChapter, setOpenChapter] = useState<string | null>(
    chapters?.[0]?.id ?? null
  )

  const toggleChapter = (id: string) => {
    setOpenChapter((prev) => (prev === id ? null : id))
  }

  const chaptersFilter = chapters.filter(
    (chapter) => chapter.subjectId === id
  )

  return (
    <div className="space-y-5">
      {chaptersFilter.map((chapter, index) => {
        const opened = openChapter === chapter.id

        const chapterTopics = topics.filter(
          (topic) => topic.chapterId === chapter.id
        )

        const selectedCount = chapterTopics.filter((topic) =>
          selectedTopics.includes(topic.id)
        ).length

        return (
          <div
            key={chapter.id}
            className={`overflow-hidden rounded-2xl bg-[#141C2D] shadow-lg transition-all ${theme.border} ${theme.hover}`}
          >
            {/* Header */}
            <button
              onClick={() => toggleChapter(chapter.id)}
              className="flex w-full items-center justify-between p-6 transition hover:bg-white/5"
            >
              <div className="flex items-start gap-5">
                {/* Number */}
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-xl font-bold text-white ${theme.bg}`}
                >
                  {index + 1}
                </div>

                {/* Info */}
                <div className="text-left">
                  <p className="text-xs uppercase tracking-widest text-gray-400">
                    Chapter {index + 1}
                  </p>

                  <h3 className="mt-1 text-xl font-semibold text-white">
                    {chapter.title}
                  </h3>

                  {/* Stats */}
                  <div className="mt-3 flex flex-wrap gap-2">
                    <span className="flex items-center gap-2 rounded-full bg-white/5 px-3 py-1 text-xs text-gray-300">
                      <BookOpen size={13} className={theme.icon} />
                      {chapterTopics.length} Topics
                    </span>

                    <span className="flex items-center gap-2 rounded-full bg-white/5 px-3 py-1 text-xs text-gray-300">
                      <FileQuestion size={13} className={theme.icon} />
                      {chapter.totalQuestions} Questions
                    </span>

                    <span
                      className={`flex items-center gap-2 rounded-full px-3 py-1 text-xs ${theme.bg} ${theme.text}`}
                    >
                      <CheckCircle2 size={13} className={theme.icon} />
                      {selectedCount} Selected
                    </span>
                  </div>

                  {/* Progress */}
                  <div className="mt-5 flex items-center gap-3">
                    <div className="h-2 w-56 overflow-hidden rounded-full bg-white/10">
                      <div
                        className={`h-full rounded-full transition-all ${color.progress}`}
                        style={{
                          width: `${chapter.progress}%`,
                        }}
                      />
                    </div>

                    <span className={`text-xs font-medium ${theme.text}`}>
                      {chapter.progress}%
                    </span>
                  </div>
                </div>
              </div>

              <ChevronDown
                size={24}
                className={`transition-transform duration-300 ${
                  opened ? "rotate-180" : ""
                } ${theme.icon}`}
              />
            </button>

            {/* Topics */}
            <div
              className={`grid transition-all duration-300 ${
                opened ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
              }`}
            >
              <div className="overflow-hidden">
                <div
                  className={`space-y-4 border-t ${theme.border} bg-black/10 p-6`}
                >
                  {chapterTopics.length === 0 ? (
                    <div
                      className={`rounded-xl border border-dashed ${theme.border} py-10 text-center text-sm text-gray-500`}
                    >
                      No topics available.
                    </div>
                  ) : (
                    chapterTopics.map((topic) => (
                      <ChapterCard
                        key={topic.id}
                        topic={topic}
                        selected={selectedTopics.includes(topic.id)}
                        onToggle={onToggleTopic}
                        color={color}
                      />
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
