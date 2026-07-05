"use client"

import { FileQuestion, Hash, Layers } from "lucide-react"

import TopicCheckbox from "../Topics/TopicCheckbox"
import { Topic } from "@/app/data/topicsData"
import { color } from "@/app/type"
import { getTheme } from "@/app/data/colorPalete"

interface Props {
  topic: Topic
  selected: boolean
  onToggle: (id: string) => void
  color: color
}

export default function ChapterCard({
  topic,
  selected,
  onToggle,
  color,
}: Props) {
  const theme = getTheme(color.name)

  return (
    <div
      onClick={() => onToggle(topic.id)}
      className={`cursor-pointer rounded-xl border transition-all duration-300 ${
        selected
          ? `${theme.border} ${theme.bg}`
          : `border-white/10 bg-[#182233] hover:bg-white/5 ${theme.hover}`
      }`}
    >
      <div className="flex items-start gap-4 p-5">
        <TopicCheckbox
          checked={selected}
          onChange={() => onToggle(topic.id)}
          color={color}
        />

        <div className="flex-1">
          {/* Header */}
          <div className="flex items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-semibold text-white">
                {topic.title}
              </h3>

              {topic.description && (
                <p className="mt-1 text-sm text-gray-400">
                  {topic.description}
                </p>
              )}
            </div>

            <StatusBadge
              status={topic.status}
              color={color}
            />
          </div>

          {/* Meta */}
          <div className="mt-4 flex flex-wrap gap-5 text-sm text-gray-400">
            <span className="flex items-center gap-2">
              <FileQuestion
                size={15}
                className={theme.icon}
              />
              {topic.totalQuestions} Questions
            </span>

            <span className="flex items-center gap-2">
              <Layers
                size={15}
                className={theme.icon}
              />
              {topic.questionIds.length} Linked IDs
            </span>

            <span className="flex items-center gap-2">
              <Hash
                size={15}
                className={theme.icon}
              />
              Topic {topic.order}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

interface StatusBadgeProps {
  status: Topic["status"]
  color: color
}

function StatusBadge({
  status,
  color,
}: StatusBadgeProps) {
  const theme = getTheme(color.name)

  const styles = {
    published: `${theme.bg} ${theme.text}`,
    draft: "bg-yellow-500/10 text-yellow-400",
    archived: "bg-red-500/10 text-red-400",
  }

  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${styles[status]}`}
    >
      {status}
    </span>
  )
}

