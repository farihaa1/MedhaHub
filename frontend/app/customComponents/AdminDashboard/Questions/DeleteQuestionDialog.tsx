
"use client"

import { Trash2 } from "lucide-react"
import { toast } from "sonner"

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
  const [deleteQuestion, { isLoading }] =
    useDeleteQuestionMutation()

  async function handleDelete() {
    try {
      await deleteQuestion(question._id).unwrap()

      toast.success("প্রশ্নটি সফলভাবে মুছে ফেলা হয়েছে")

      onOpenChange(false)
    } catch (error) {
      const err = error as FetchBaseQueryError & {
        data?: {
          message?: string
        }
      }

      toast.error(
        err.data?.message ??
          "প্রশ্নটি মুছে ফেলা সম্ভব হয়নি"
      )
    }
  }

  return (
    <AlertDialog
      open={open}
      onOpenChange={(value) => {
        if (!isLoading) {
          onOpenChange(value)
        }
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center justify-center gap-2 text-center">
            <Trash2 className="h-5 w-5 text-destructive" />
            প্রশ্ন মুছে ফেলবেন?
          </AlertDialogTitle>

          <AlertDialogDescription className="space-y-4 text-center">
            <span className="block">
              আপনি কি নিশ্চিতভাবে এই প্রশ্নটি মুছে ফেলতে
              চান?
            </span>

            <span className="block rounded-lg border bg-muted p-4 text-left text-sm leading-6 text-foreground">
              {question.questionText}
            </span>

            <span className="block font-medium text-destructive">
              এই কাজটি আর পূর্বাবস্থায় ফিরিয়ে আনা যাবে না।
            </span>
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>
            বাতিল
          </AlertDialogCancel>

          <AlertDialogAction
            onClick={(event) => {
              event.preventDefault()
              handleDelete()
            }}
            disabled={isLoading}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isLoading ? "মুছে ফেলা হচ্ছে..." : "মুছে ফেলুন"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
