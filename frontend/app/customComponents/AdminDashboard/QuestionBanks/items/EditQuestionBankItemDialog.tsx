"use client"

import { useEffect } from "react"
import { useForm } from "react-hook-form"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import { useUpdateQuestionBankItemMutation } from "@/app/redux/api/questionBankItemApi"

import type { IQuestionBankItem } from "@/app/redux/types/questionBank.types"

interface Props {
  item: IQuestionBankItem
  open: boolean
  onOpenChange: (open: boolean) => void
}

interface QuestionBankItemFormValues {
  order: number
  marks?: number
  negativeMarks?: number
}

export default function EditQuestionBankItemDialog({
  item,
  open,
  onOpenChange,
}: Props) {
  const [updateItem, { isLoading }] = useUpdateQuestionBankItemMutation()

  const { register, handleSubmit, reset } = useForm<QuestionBankItemFormValues>(
    {
      defaultValues: {
        order: item.order,
        marks: item.marks,
        negativeMarks: item.negativeMarks,
      },
    }
  )

  useEffect(() => {
    reset({
      order: item.order,
      marks: item.marks,
      negativeMarks: item.negativeMarks,
    })
  }, [item, reset])

  const onSubmit = async (values: QuestionBankItemFormValues) => {
    try {
      await updateItem({
        id: item._id,
        data: values,
      }).unwrap()

      onOpenChange(false)
    } catch (error) {
      console.error("Failed to update question bank item:", error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Question Bank Item</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="order" className="text-sm font-medium">
              Order
            </label>

            <Input
              id="order"
              type="number"
              {...register("order", {
                valueAsNumber: true,
              })}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="marks" className="text-sm font-medium">
              Marks
            </label>

            <Input
              id="marks"
              type="number"
              step="0.25"
              {...register("marks", {
                valueAsNumber: true,
              })}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="negativeMarks" className="text-sm font-medium">
              Negative Marks
            </label>

            <Input
              id="negativeMarks"
              type="number"
              step="0.25"
              {...register("negativeMarks", {
                valueAsNumber: true,
              })}
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>

            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
