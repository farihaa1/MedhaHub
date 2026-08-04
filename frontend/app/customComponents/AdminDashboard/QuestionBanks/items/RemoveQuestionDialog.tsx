"use client"

import { useRemoveQuestionFromBankMutation } from "@/app/redux/api/questionBankItemApi"
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


interface Props {
  open: boolean

  onOpenChange: (open: boolean) => void

  questionBankId: string

  questionId: string
}

export default function RemoveQuestionDialog({
  open,

  onOpenChange,

  questionBankId,

  questionId,
}: Props) {
  const [removeQuestion, { isLoading }] = useRemoveQuestionFromBankMutation()

  const handleRemove = async () => {
    await removeQuestion({
      questionBankId,

      questionId,
    }).unwrap()

    onOpenChange(false)
  }

  return (
    <AlertDialog
      open={open}

      onOpenChange={onOpenChange}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Remove Question?</AlertDialogTitle>

          <AlertDialogDescription>
            This question will be removed from this question bank. The original
            question will not be deleted.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>

          <AlertDialogAction
            onClick={handleRemove}

            disabled={isLoading}
          >
            {isLoading ? "Removing..." : "Remove"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
