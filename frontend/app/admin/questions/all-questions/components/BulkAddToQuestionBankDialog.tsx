"use client"

import { useState } from "react"
import { toast } from "sonner"
import { FetchBaseQueryError } from "@reduxjs/toolkit/query"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { Button } from "@/components/ui/button"

import { useBulkAddQuestionsMutation } from "@/app/redux/api/questionBankItemApi"

import { useGetQuestionBanksQuery } from "@/app/redux/api/questionBanksApi"

import { IQuestionBank } from "@/app/redux/types/questionBank.types"

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  questionIds: string[]
}

export default function BulkAddToQuestionBankDialog({
  open,
  onOpenChange,
  questionIds,
}: Props) {
  const [questionBankId, setQuestionBankId] = useState("")

  const { data, isLoading } = useGetQuestionBanksQuery({})

  const [bulkAddQuestions, { isLoading: saving }] =
    useBulkAddQuestionsMutation()

  const banks: IQuestionBank[] = data?.data?.data ?? []

  const handleSubmit = async () => {
    if (!questionBankId) {
      toast.error("Please select a Question Bank.")
      return
    }

    if (!questionIds.length) {
      toast.error("No questions selected.")
      return
    }

    try {
      await bulkAddQuestions({
        questionBankId,

        data: {
          questionIds,
        },
      }).unwrap()

      toast.success(`${questionIds.length} questions added successfully.`)

      setQuestionBankId("")
      onOpenChange(false)
    } catch (err) {
      const error = err as FetchBaseQueryError & {
        data?: {
          message?: string
        }
      }

      toast.error(error.data?.message ?? "Failed to add questions.")
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Add To Question Bank</DialogTitle>

          <DialogDescription>
            Add all selected questions into an existing Question Bank.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5">
          <div>
            <p className="mb-2 text-sm font-medium">Question Bank</p>

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
          </div>

          <div className="rounded-lg border p-4">
            <p className="text-sm text-muted-foreground">Selected Questions</p>

            <p className="mt-1 text-2xl font-bold">{questionIds.length}</p>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>

            <Button
              disabled={saving || isLoading || !questionIds.length}
              onClick={handleSubmit}
            >
              {saving ? "Adding..." : "Add Questions"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
