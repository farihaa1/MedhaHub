"use client"

import { useState } from "react"

import { Plus } from "lucide-react"

import { useForm, FormProvider } from "react-hook-form"

import { zodResolver } from "@hookform/resolvers/zod"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import { Button } from "@/components/ui/button"

import QuestionForm from "./QuestionForm"

import { questionSchema, QuestionFormValues } from "./question.schema"

export default function CreateQuestionDialog() {
  const [open, setOpen] = useState(false)

  const methods = useForm<QuestionFormValues>({
    resolver: zodResolver(questionSchema),

    defaultValues: {
      subjectId: "",

      chapterId: "",

      topicId: "",

      question: "",

      options: [{ text: "" }, { text: "" }, { text: "" }, { text: "" }],

      correctAnswer: 0,

      explanation: "",

      difficulty: "easy",

      type: "mcq",

      source: "custom",

      marks: 1,

      negativeMarks: 0,

      tags: [],
    },
  })

  async function onSubmit(values: QuestionFormValues) {
    console.log(values)

    methods.reset()

    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Question
        </Button>
      </DialogTrigger>

      <DialogContent className="max-h-[90vh] max-w-6xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Question</DialogTitle>

          <DialogDescription>
            Add a new question to the question bank.
          </DialogDescription>
        </DialogHeader>

        <FormProvider {...methods}>
          <QuestionForm onSubmit={onSubmit} isLoading={false} />
        </FormProvider>
      </DialogContent>
    </Dialog>
  )
}
