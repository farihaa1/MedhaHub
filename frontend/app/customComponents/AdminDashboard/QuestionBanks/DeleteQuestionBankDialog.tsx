"use client"

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"

import { Button } from "@/components/ui/button"

import { toast } from "sonner"

import { IQuestionBank } from "@/app/redux/types/questionBank.types"

import { useDeleteQuestionBankMutation } from "@/app/redux/api/questionBankApi"

interface Props {
  open: boolean

  onOpenChange: (open: boolean) => void

  bank: IQuestionBank | null
}

export default function DeleteQuestionBankDialog({
  open,

  onOpenChange,

  bank,
}: Props) {
  const [deleteQuestionBank, { isLoading }] = useDeleteQuestionBankMutation()

  const handleDelete = async () => {
    if (!bank) return

    try {
      await deleteQuestionBank(bank._id).unwrap()

      toast.success("Question Bank deleted successfully")

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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Question Bank</DialogTitle>

          <DialogDescription>
            Are you sure you want to delete{" "}
            <span className="font-semibold text-foreground">{bank?.title}</span>
            ? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button
            variant="outline"

            disabled={isLoading}

            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>

          <Button
            variant="destructive"

            disabled={isLoading}

            onClick={handleDelete}
          >
            {isLoading ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
