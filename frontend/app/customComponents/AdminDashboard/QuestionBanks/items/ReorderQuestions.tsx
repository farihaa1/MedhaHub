"use client"

import { DragEndEvent } from "@dnd-kit/core"
import { useReorderQuestionsMutation } from "@/app/redux/api/questionBankItemApi"
import { DndContext, closestCenter } from "@dnd-kit/core"

import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"

import { useState } from "react"
import { IQuestion } from "@/app/redux/api/api.type"


interface Props {
  questionBankId: string
  items: IQuestion[]
}

export default function ReorderQuestions({
  questionBankId,
  items,
}: Props){
  const [questions, setQuestions] = useState(items)
  const [reorderQuestions] = useReorderQuestionsMutation()


  const handleDragEnd = async(event: DragEndEvent) => {
    const { active, over } = event
    if (!over) return

    if (active.id !== over.id) {
      const oldIndex = questions.findIndex((q) => q._id === active.id)
      const newIndex = questions.findIndex((q) => q._id === over.id)
      const updated = arrayMove(questions, oldIndex, newIndex)

      setQuestions(updated)

      try {
        await reorderQuestions({
          questionBankId,
          items: updated.map((item, index) => ({
            id: item._id,
            order: index + 1,
          })),
        }).unwrap()
      } catch {
        setQuestions(questions)
      }
    }
  }

  return (
    <DndContext
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={questions.map((q) => q._id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-2">
          {questions.map((item) => (
            <div
              key={item._id}
              className="rounded border p-3"
            >
              {item.question}
            </div>
          ))}
        </div>
      </SortableContext>
    </DndContext>
  )
}
