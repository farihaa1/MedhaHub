"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

import { toast } from "sonner"

import QuestionBankForm from "./QuestionBankForm"

import { useCreateQuestionBankMutation } from "@/app/redux/api/questionBankApi"

import { IQuestionBankForm } from "@/app/redux/types/questionBank.types"

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function CreateQuestionBankDialog({
  open,
  onOpenChange,
}: Props) {
  const [createQuestionBank, { isLoading }] = useCreateQuestionBankMutation()

  const handleSubmit = async (values: IQuestionBankForm) => {
    try {
      await createQuestionBank(values).unwrap()

      toast.success("Question Bank created successfully")

      onOpenChange(false)
    } catch (error: unknown) {
      let message = "Failed to create Question Bank"

      if (error && typeof error === "object" && "data" in error) {
        const apiError = error as {
          data?: {
            message?: string
          }
        }

        message = apiError.data?.message ?? message
      }

      toast.error(message)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create Question Bank</DialogTitle>
        </DialogHeader>

        <QuestionBankForm
          onSubmit={handleSubmit}

          loading={isLoading}
        />
      </DialogContent>
    </Dialog>
  )
}
