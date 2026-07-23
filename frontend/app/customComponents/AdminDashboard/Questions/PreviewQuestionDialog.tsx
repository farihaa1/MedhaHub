"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

import QuestionPreview from "./QuestionPreview"
import { useGetQuestionQuery } from "@/app/redux/api/questionsApi"

export interface PreviewQuestion {
  _id: string

  question: string
  questionImage?: string

  options: {
    text: string
    image?: string
  }[]

  correctAnswer: number

  explanation?: string
  explanationImage?: string

  subject?: {
    _id: string
    name: string
  }

  chapter?: {
    _id: string
    name: string
  }

  topic?: {
    _id: string
    name: string
  }

  difficulty?: string
  type?: string
  source?: string

  marks?: number
  negativeMarks?: number

  tags?: string[]
}

interface PreviewQuestionDialogProps {
  questionId: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function PreviewQuestionDialog({
  questionId,
  open,
  onOpenChange,
}: PreviewQuestionDialogProps) {
  const { data, isLoading, isError } = useGetQuestionQuery(questionId, {
    skip: !open || !questionId,
  })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-5xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Question Preview</DialogTitle>

          <DialogDescription>
            This preview shows how the question will appear to students during
            an exam.
          </DialogDescription>
        </DialogHeader>

        {isLoading && (
          <div className="flex justify-center py-10">Loading...</div>
        )}

        {isError && (
          <div className="py-10 text-center text-destructive">
            Failed to load question.
          </div>
        )}

        {data?.data && <QuestionPreview question={data.data} />}
      </DialogContent>
    </Dialog>
  )
}
