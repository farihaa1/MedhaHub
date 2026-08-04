"use client"
import { useState } from "react"
import { ChevronDown, BookOpen, FileQuestion, CheckCircle2 } from "lucide-react"
import ChapterCard from "./ChapterCard"
import { color } from "@/app/type"
import { getTheme } from "@/app/data/colorPalete"
import { IChapter } from "@/app/redux/api/chaptersApi"
import { useGetTopicsByChapterQuery } from "@/app/redux/api/topicsApi"

interface Props {
  chapters: IChapter[]
  color: color
  selectedTopics: string[]
  onToggleTopic: (id: string) => void
}

export default function ChapterAccordion({
  chapters,
  color,
  selectedTopics,
  onToggleTopic,
}: Props) {
  const theme = getTheme(color.name)

  const [openChapter, setOpenChapter] = useState<string | null>(
    chapters[0]?._id ?? null
  )

  return (
    <div className="space-y-5">
      {chapters.map((chapter, index) => (
        <ChapterItem
          key={chapter._id}
          chapter={chapter}
          index={index}
          color={color}
          theme={theme}
          open={openChapter === chapter._id}
          onOpen={() =>
            setOpenChapter((prev) =>
              prev === chapter._id ? null : chapter._id
            )
          }
          selectedTopics={selectedTopics}
          onToggleTopic={onToggleTopic}
        />
      ))}
    </div>
  )
}

interface ChapterItemProps {
  chapter: IChapter
  index: number
  color: color
  theme: ReturnType<typeof getTheme>
  open: boolean
  onOpen: () => void
  selectedTopics: string[]
  onToggleTopic: (id: string) => void
}

function ChapterItem({
  chapter,
  index,
  color,
  theme,
  open,
  onOpen,
  selectedTopics,
  onToggleTopic,
}: ChapterItemProps) {
  const { data } = useGetTopicsByChapterQuery(chapter._id, {
    skip: !open,
  })

  const topics = data?.data ?? []
  console.log(topics)

  const selectedCount = topics.filter((topic) =>
    selectedTopics.includes(topic._id)
  ).length

  return (
    <div
      className={`overflow-hidden rounded-2xl bg-[#141C2D] shadow-lg transition-all ${theme.border} ${theme.hover}`}
    >
      <button
        onClick={onOpen}
        className="flex w-full items-center justify-between p-6 transition hover:bg-white/5"
      >
        <div className="flex items-start gap-5">
          <div
            className={`flex h-12 w-12 items-center justify-center rounded-xl font-bold text-white ${theme.bg}`}
          >
            {index + 1}
          </div>

          <div className="text-left">
            <p className="text-xs tracking-widest text-gray-400 uppercase">
              Chapter {index + 1}
            </p>

            <h3 className="mt-1 text-xl font-semibold text-white">
              {chapter.title}
            </h3>

            <div className="mt-3 flex flex-wrap gap-2">
              <span className="flex items-center gap-2 rounded-full bg-white/5 px-3 py-1 text-xs text-gray-300">
                <BookOpen size={13} className={theme.icon} />
                {topics.length} Topics
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

            <div className="mt-5 flex items-center gap-3">
              <div className="h-2 w-56 overflow-hidden rounded-full bg-white/10">
                <div
                  className={`${color.progress} h-full rounded-full`}
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
          className={`${theme.icon} transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      <div
        className={`grid transition-all duration-300 ${
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden">
          <div className={`space-y-4 border-t ${theme.border} bg-black/10 p-6`}>
            {topics.length === 0 ? (
              <div
                className={`rounded-xl border border-dashed ${theme.border} py-10 text-center text-sm text-gray-500`}
              >
                No topics available.
              </div>
            ) : (
              topics.map((topic) => (
                <ChapterCard
                  key={topic._id}
                  topic={topic}
                  selected={selectedTopics.includes(topic._id)}
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
}
