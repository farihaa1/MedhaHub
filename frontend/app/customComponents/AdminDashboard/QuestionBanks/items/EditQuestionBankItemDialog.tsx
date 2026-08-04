"use client"

import { useEffect } from "react"
import { useForm } from "react-hook-form"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import { Pencil } from "lucide-react"

import { useUpdateQuestionBankItemMutation } from "@/app/redux/api/questionBankItemApi"
import { IQuestionBankItem } from "./QuestionBankItemColumns"

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

  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      order: item.order,
      marks: item.marks,
      negativeMarks: item.negativeMarks,
    },
  })

  useEffect(() => {
    reset({
      order: item.order,
      marks: item.marks,
      negativeMarks: item.negativeMarks,
    })
  }, [item, reset])

  const onSubmit = async (values: QuestionBankItemFormValues) => {
    await updateItem({
      id: item._id,
      data: values,
    }).unwrap()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Question Bank Item</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            type="number"
            {...register("order", {
              valueAsNumber: true,
            })}
          />

          <Input
            type="number"
            {...register("marks", {
              valueAsNumber: true,
            })}
          />

          <Input
            type="number"
            step="0.25"
            {...register("negativeMarks", {
              valueAsNumber: true,
            })}
          />

          <Button disabled={isLoading}>Save Changes</Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
