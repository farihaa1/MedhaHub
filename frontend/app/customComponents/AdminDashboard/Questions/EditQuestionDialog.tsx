"use client"

import { useEffect } from "react"
import { toast } from "sonner"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

import QuestionForm from "./QuestionForm"

import {
  useGetQuestionQuery,
  useUpdateQuestionMutation,
} from "@/app/redux/api/questionsApi"

interface EditQuestionDialogProps {
  questionId: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function EditQuestionDialog({
  questionId,
  open,
  onOpenChange,
}: EditQuestionDialogProps) {
  const { data, isLoading, isFetching, isError } = useGetQuestionQuery(
    questionId,
    {
      skip: !open || !questionId,
    }
  )

  const [
    updateQuestion,
    { isLoading: isUpdating, isSuccess, isError: updateError, error },
  ] = useUpdateQuestionMutation()

  useEffect(() => {
    if (isSuccess) {
      toast.success("Question updated successfully")
      onOpenChange(false)
    }
  }, [isSuccess, onOpenChange])

  useEffect(() => {
    if (updateError) {
      toast.error("Failed to update question")
      console.error(error)
    }
  }, [updateError, error])

  async function handleSubmit(values: any) {
    await updateQuestion({
      id: questionId,
      data: values,
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-6xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Question</DialogTitle>

          <DialogDescription>Update question information.</DialogDescription>
        </DialogHeader>

        {(isLoading || isFetching) && (
          <div className="py-12 text-center">Loading...</div>
        )}

        {isError && (
          <div className="py-12 text-center text-destructive">
            Failed to load question.
          </div>
        )}

        {data?.data && (
          <QuestionForm
            mode="edit"
            defaultValues={data.data}
            loading={isUpdating}
            onSubmit={handleSubmit}
          />
        )}
      </DialogContent>
    </Dialog>
  )
}
