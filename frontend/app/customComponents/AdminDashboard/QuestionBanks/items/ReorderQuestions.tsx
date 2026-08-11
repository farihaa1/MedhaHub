"use client"

import { useState } from "react"
import { DndContext, closestCenter, type DragEndEvent } from "@dnd-kit/core"

import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"

import { useReorderQuestionsMutation } from "@/app/redux/api/questionBankItemApi"
import { IQuestion } from "@/app/redux/api/questionsApi"

import SortableQuestion from "./SortableQuestion"

interface Props {
  questionBankId: string
  items: IQuestion[]
}

export default function ReorderQuestions({ questionBankId, items }: Props) {
  const [optimisticQuestions, setOptimisticQuestions] = useState<
    IQuestion[] | null
  >(null)

  const questions = optimisticQuestions ?? items

  const [reorderQuestions] = useReorderQuestionsMutation()

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event

    if (!over || active.id === over.id) {
      return
    }

    const oldIndex = questions.findIndex(
      (question) => question._id === active.id
    )

    const newIndex = questions.findIndex((question) => question._id === over.id)

    if (oldIndex === -1 || newIndex === -1) {
      return
    }

    const previousQuestions = questions

    const updatedQuestions = arrayMove(questions, oldIndex, newIndex)

    setOptimisticQuestions(updatedQuestions)

    try {
      await reorderQuestions({
        questionBankId,
        items: updatedQuestions.map((question, index) => ({
          id: question._id,
          order: index + 1,
        })),
      }).unwrap()
      setOptimisticQuestions(null)
    } catch (error) {
      console.error("Failed to reorder questions:", error)

      // Rollback if API fails
      setOptimisticQuestions(previousQuestions)
    }
  }

  return (
    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext
        items={questions.map((question) => question._id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-2">
          {questions.map((question) => (
            <SortableQuestion key={question._id} question={question} />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  )
}
