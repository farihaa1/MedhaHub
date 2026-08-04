"use client"

import { Trash2 } from "lucide-react"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

import { useDeleteQuestionMutation } from "@/app/redux/api/questionsApi"
import { toast } from "sonner"

import { IQuestion } from "@/app/redux/api/questionsApi"
import { FetchBaseQueryError } from "@reduxjs/toolkit/query"

interface DeleteQuestionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  question: IQuestion
}

export default function DeleteQuestionDialog({
  open,
  onOpenChange,
  question,
}: DeleteQuestionDialogProps) {
  const [deleteQuestion, { isLoading }] = useDeleteQuestionMutation()

  async function handleDelete() {
    try {
      await deleteQuestion(question._id).unwrap()

      toast.success("Question deleted successfully")

      onOpenChange(false)
    } catch (error) {
      if ("status" in (error as FetchBaseQueryError)) {
        const err = error as FetchBaseQueryError & {
          data?: { message?: string }
        }

        toast.error(err.data?.message ?? "Failed to delete question")
      } else {
        toast.error("Unexpected error")
      }
    }
  }
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10">
            <Trash2 className="h-7 w-7 text-destructive" />
          </div>

          <AlertDialogTitle className="text-center">
            Delete Question
          </AlertDialogTitle>

          <AlertDialogDescription className="space-y-3 text-center">
            <span className="block">
              Are you sure you want to permanently delete this question?
            </span>

            <span className="block rounded-md border bg-muted p-3 text-left text-sm">
              {question.questionText}
            </span>

            <span className="block text-destructive">
              This action cannot be undone.
            </span>
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>

          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault()
              handleDelete()
            }}
            disabled={isLoading}
            className="bg-destructive hover:bg-destructive/90"
          >
            {isLoading ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
