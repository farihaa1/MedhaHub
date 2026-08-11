"use client"

import { GripVertical } from "lucide-react"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"

import { IQuestion } from "@/app/redux/api/questionsApi"

interface Props {
  question: IQuestion
}

export default function SortableQuestion({ question }: Props) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: question._id,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-3 rounded-lg border border-border bg-card p-3 transition-shadow ${
        isDragging ? "z-10 shadow-lg" : "hover:bg-muted/40"
      }`}
    >
      {/* Drag handle */}
      <button
        type="button"
        {...attributes}
        {...listeners}
        aria-label="প্রশ্নের অবস্থান পরিবর্তন করুন"
        className="shrink-0 cursor-grab text-muted-foreground hover:text-foreground active:cursor-grabbing"
      >
        <GripVertical className="h-4 w-4" />
      </button>

      {/* Question */}
      <div className="min-w-0 flex-1">
        <p className="text-sm leading-6 text-foreground">
          {question.questionText}
        </p>
      </div>
    </div>
  )
}
