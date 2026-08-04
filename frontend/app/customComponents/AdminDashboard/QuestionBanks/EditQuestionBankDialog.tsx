"use client"

import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import {
  IQuestionBank,
  IQuestionBankForm,
  TQuestionBankCategory,
  TQuestionBankPaper,
  TQuestionBankVisibility,
} from "@/app/redux/types/questionBank.types"
import { QuestionBankFormValues, questionBankSchema } from "./QuestionBankForm"
import { useUpdateQuestionBankMutation } from "@/app/redux/api/questionBanksApi"

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

  const form = useForm<QuestionBankFormValues>({
    resolver: zodResolver(questionBankSchema),
  })

  const { register, handleSubmit, reset, setValue, watch } = form

  useEffect(() => {
    if (!bank) return

    reset({
      title: bank.title,
      category: bank.category,
      year: bank.year,
      paper: bank.paper,
      organization: bank.organization ?? "",
      description: bank.description ?? "",
      visibility: bank.visibility,
      isPublished: bank.isPublished,
      isPremium: bank.isPremium,
    })
  }, [bank, reset])

  const submit = async (values: QuestionBankFormValues) => {
    if (!bank) return

    try {
      await updateQuestionBank({
        id: bank._id,
        body: values,
      }).unwrap()

      toast.success("Question bank updated successfully.")
      onOpenChange(false)
    } catch (error) {
      console.error(error)

      toast.error("Failed to update question bank.")
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit Question Bank</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(submit)} className="space-y-5">
          <Input placeholder="Title" {...register("title")} />

          <Select
            value={watch("category")}
            onValueChange={(v) =>
              setValue("category", v as TQuestionBankCategory)
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Category" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="bcs">BCS</SelectItem>
              <SelectItem value="ntrca">NTRCA</SelectItem>
              <SelectItem value="psc-non-cadre">PSC Non Cadre</SelectItem>
              <SelectItem value="bank">Bank</SelectItem>
              <SelectItem value="government">Government</SelectItem>
              <SelectItem value="defence">Defence</SelectItem>
              <SelectItem value="health">Health</SelectItem>
              <SelectItem value="admission">Admission</SelectItem>
              <SelectItem value="teacher">Teacher</SelectItem>
              <SelectItem value="others">Others</SelectItem>
            </SelectContent>
          </Select>

          <Input
            type="number"
            placeholder="Year"
            {...register("year", {
              valueAsNumber: true,
            })}
          />

          <Select
            value={watch("paper") ?? ""}
            onValueChange={(v) => setValue("paper", v as TQuestionBankPaper)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Paper" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="PRELIMINARY">Preliminary</SelectItem>

              <SelectItem value="WRITTEN">Written</SelectItem>

              <SelectItem value="VIVA">Viva</SelectItem>
            </SelectContent>
          </Select>

          <Input placeholder="Organization" {...register("organization")} />

          <Textarea placeholder="Description" {...register("description")} />

          <Select
            value={watch("visibility")}
            onValueChange={(v) =>
              setValue("visibility", v as TQuestionBankVisibility)
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="PUBLIC">Public</SelectItem>

              <SelectItem value="PRIVATE">Private</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex justify-end">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Updating..." : "Update Question Bank"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
