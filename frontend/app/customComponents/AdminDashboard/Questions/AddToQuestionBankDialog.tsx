"use client"

import { useState } from "react"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

import { Button } from "@/components/ui/button"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { useGetQuestionBanksQuery } from "@/app/redux/api/questionBankApi"

import { useAddQuestionToBankMutation } from "@/app/redux/api/questionBankItemApi"

import { toast } from "sonner"
import { IQuestionBank } from "@/app/redux/types/questionBank.types"
import { FetchBaseQueryError } from "@reduxjs/toolkit/query"

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void

  questionId: string
}

export default function AddToQuestionBankDialog({
  open,
  onOpenChange,
  questionId,
}: Props) {
  const [questionBankId, setQuestionBankId] = useState("")

  const { data, isLoading } = useGetQuestionBanksQuery({})

  const [addQuestion, { isLoading: saving }] = useAddQuestionToBankMutation()

  const banks: IQuestionBank[] = data?.data?.data ?? []

  const handleSubmit = async () => {
    if (!questionBankId) {
      toast.error("Select Question Bank")

      return
    }

    try {
      await addQuestion({
        questionBankId,
        data: {
          question: questionId,
        },
      }).unwrap()

      toast.success("Question Added")

      onOpenChange(false)
    } catch (err: unknown) {
      const error = err as FetchBaseQueryError & {
        data?: {
          message?: string
        }
      }

      toast.error(error.data?.message ?? "Failed")
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Question To Bank</DialogTitle>
        </DialogHeader>

        <Select value={questionBankId} onValueChange={setQuestionBankId}>
          <SelectTrigger>
            <SelectValue placeholder="Select Question Bank" />
          </SelectTrigger>

          <SelectContent>
            {banks.map((bank) => (
              <SelectItem key={bank._id} value={bank._id}>
                {bank.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button disabled={saving || isLoading} onClick={handleSubmit}>
          Add
        </Button>
      </DialogContent>
    </Dialog>
  )
}
