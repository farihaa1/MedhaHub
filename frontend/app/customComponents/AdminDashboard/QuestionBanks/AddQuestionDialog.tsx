
"use client"

import { useState } from "react"

import { Button } from "@/components/ui/button"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import { useBulkAddQuestionsMutation } from "@/app/redux/api/questionBankItemApi"

import QuestionSelectorTable from "./QuestionSelectorTable"

interface Props {
  questionBankId: string
}

export default function AddQuestionDialog({
  questionBankId,
}: Props) {
  const [open, setOpen] = useState(false)

  const [selectedQuestions, setSelectedQuestions] =
    useState<string[]>([])

  const [bulkAddQuestions, { isLoading }] =
    useBulkAddQuestionsMutation()

  const handleAdd = async () => {
    if (!selectedQuestions.length) {
      return
    }

    try {
      const res = await bulkAddQuestions({
        questionBankId,
        data: {
          questionIds: selectedQuestions,
        },
      }).unwrap()

      console.log("Questions added:", res)

      setSelectedQuestions([])
      setOpen(false)
    } catch (error) {
      console.error("Failed to add questions:", error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          Add Questions
        </Button>
      </DialogTrigger>

      <DialogContent className="w-full max-w-5xl">
        <DialogHeader>
          <DialogTitle>
            Select Questions
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <QuestionSelectorTable
            onSelect={setSelectedQuestions}
          />

          <div className="flex items-center justify-between border-t pt-4">
            <p className="text-sm text-muted-foreground">
              Selected:{" "}
              <span className="font-semibold text-foreground">
                {selectedQuestions.length}
              </span>
            </p>

            <Button
              onClick={handleAdd}
              disabled={
                isLoading ||
                selectedQuestions.length === 0
              }
            >
              {isLoading
                ? "Adding..."
                : "Add Selected"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
