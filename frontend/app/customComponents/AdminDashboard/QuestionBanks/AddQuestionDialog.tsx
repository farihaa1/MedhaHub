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

export default function AddQuestionDialog({ questionBankId }: Props) {
  const [open, setOpen] = useState(false)

  const [selectedQuestions, setSelectedQuestions] = useState<string[]>([])

  const [bulkAddQuestions, { isLoading }] = useBulkAddQuestionsMutation()

 const handleAdd = async () => {
   if (!selectedQuestions.length) {
     return
   }

   const res=await bulkAddQuestions({
     questionBankId,
     questionIds: selectedQuestions,
   }).unwrap()
console.log(res)
   setOpen(false)

   setSelectedQuestions([])
 }

  return (
    <Dialog  open={open} onOpenChange={setOpen}>
      <DialogTrigger  asChild>
        <Button>Add Questions</Button>
      </DialogTrigger>

      <DialogContent className="w-full min-w-5xl">
        <DialogHeader>
          <DialogTitle>Select Questions</DialogTitle>
        </DialogHeader>

        <QuestionSelectorTable onSelect={setSelectedQuestions} />

        <div className="flex items-center justify-between">
          <p>Selected: {selectedQuestions.length}</p>

          <Button
            onClick={handleAdd}

            disabled={isLoading || !selectedQuestions.length}
          >
            {isLoading ? "Adding..." : "Add Selected"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
