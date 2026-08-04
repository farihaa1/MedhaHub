"use client"

import Link from "next/link"

import { ArrowRight, FileQuestion } from "lucide-react"

import type { ITopic } from "@/app/redux/api/topicsApi"

interface TopicCardProps {
  topic: ITopic
  subjectSlug: string
}

export default function TopicCard({ topic, subjectSlug }: TopicCardProps) {
  console.log("TOPIC CARD:", {
    topic,
    subjectSlug,
  })

  return (
    <Link
      href={`/questions/topic/${topic._id}`}
      className="group block"
    >
      <article className="rounded-sm border bg-card p-5 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-[15px] leading-tight font-semibold">
              {topic.title}
            </h2>

            <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
              <FileQuestion className="h-3 w-3" />

              <span>{topic.totalQuestions ?? 0} Questions</span>
            </div>
          </div>

          <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
        </div>
      </article>
    </Link>
  )
}
