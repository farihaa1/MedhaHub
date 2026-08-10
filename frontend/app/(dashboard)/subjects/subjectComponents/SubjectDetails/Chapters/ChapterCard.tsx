"use client"

import { FileQuestion, Hash } from "lucide-react"

import TopicCheckbox from "../Topics/TopicCheckbox"
import { ITopic } from "@/app/redux/api/topicsApi"

interface Props {
  topic: ITopic
  selected: boolean
  onToggle: (id: string) => void
}

export default function ChapterCard({ topic, selected, onToggle }: Props) {
  return (
    <div
      onClick={() => onToggle(topic._id)}
      className={`flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition-colors ${
        selected
          ? "border-foreground/20 bg-muted"
          : "border-border bg-card hover:bg-muted/40"
      }`}
    >
      {/* Checkbox */}

      <div className="pt-0.5">
        <TopicCheckbox
          checked={selected}
          onChange={() => onToggle(topic._id)}
        />
      </div>

      {/* Content */}

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-xs font-semibold text-foreground">
            {topic.title}
          </h3>

          <StatusBadge status={topic.status} />
        </div>

        {/* Topic information */}

        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[10px] text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <FileQuestion className="h-3 w-3" />
            {topic.totalQuestions}টি প্রশ্ন
          </span>

          <span className="flex items-center gap-1.5">
            <Hash className="h-3 w-3" />
            টপিক {topic.order}
          </span>
        </div>
      </div>
    </div>
  )
}

// ============================================================
// STATUS BADGE
// ============================================================

interface StatusBadgeProps {
  status: ITopic["status"]
}

function StatusBadge({ status }: StatusBadgeProps) {
  const isApproved = status === "approved"

  return (
    <span
      className={`shrink-0 rounded-full border px-2 py-0.5 text-[9px] font-medium ${
        isApproved
          ? "border-border bg-muted text-foreground"
          : "border-yellow-500/20 bg-yellow-500/10 text-yellow-700 dark:text-yellow-400"
      }`}
    >
      {status}
    </span>
  )
}
