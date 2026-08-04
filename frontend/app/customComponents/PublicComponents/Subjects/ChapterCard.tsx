"use client"

import Link from "next/link"
import { ArrowRight, FileQuestion } from "lucide-react"

import type { IChapter } from "@/app/redux/api/chaptersApi"

interface ChapterCardProps {
  chapter: IChapter
}

export default function ChapterCard({ chapter }: ChapterCardProps) {
  const subjectSlug =
    typeof chapter.subjectId === "object" ? chapter.subjectId.slug : ""

  const chapterUrl = `/subject/${subjectSlug}/chapter/${chapter._id}`

  console.log("CHAPTER CARD:", {
    subjectSlug,
    chapterId: chapter._id,
    chapterUrl,
  })

  return (
    <Link href={chapterUrl} className="group block">
      <article className="rounded-sm border bg-card p-5 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="pb-1 text-[15px] leading-tight font-semibold">
              {chapter.title}
            </h2>

            <div className="flex items-center text-[12px] text-muted-foreground">
              <FileQuestion className="mr-1 h-3 w-3" />

              <span>{chapter.totalQuestions ?? 0} Questions</span>

              <span className="px-1">•</span>

              <span>{chapter.totalTopics ?? 0} Topics</span>
            </div>
          </div>

          <ArrowRight className="mt-1 h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
        </div>
      </article>
    </Link>
  )
}
