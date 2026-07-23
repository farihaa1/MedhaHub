"use client"

import { z } from "zod"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

import { toast } from "sonner"

import { IQuestionBank } from "@/app/redux/types/questionBank.types"

import { useUpdateQuestionBankMutation } from "@/app/redux/api/questionBankApi"

import QuestionBankForm, { questionBankSchema } from "./QuestionBankForm"

interface Props {
  open: boolean

  onOpenChange: (open: boolean) => void

  bank: IQuestionBank | null
}

export default function EditQuestionBankDialog({
  open,
  onOpenChange,
  bank,
}: Props) {
  const [updateQuestionBank, { isLoading }] = useUpdateQuestionBankMutation()

  type QuestionBankFormValues = z.infer<typeof questionBankSchema>

  const handleSubmit = async (values: QuestionBankFormValues) => {
    if (!bank) return

    try {
      await updateQuestionBank({
        id: bank._id,

        data: values,
      }).unwrap()

      toast.success("Question Bank updated successfully")

      onOpenChange(false)
    } catch (error: unknown) {
      const message =
        error && typeof error === "object" && "data" in error
          ? (
              error as {
                data?: {
                  message?: string
                }
              }
            ).data?.message
          : undefined

      toast.error(message ?? "Failed to create Question Bank")
    }
  }

  if (!bank) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Question Bank</DialogTitle>
        </DialogHeader>

        <QuestionBankForm
          defaultValues={{
            title: bank.title,

            category: bank.category,

            year: bank.year,

            paper: bank.paper,

            organization: bank.organization,

            description: bank.description,

            visibility: bank.visibility,

            isPublished: bank.isPublished,

            isPremium: bank.isPremium,
          }}

          onSubmit={handleSubmit}

          loading={isLoading}
        />
      </DialogContent>
    </Dialog>
  )
}
