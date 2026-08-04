"use client"

import { useState } from "react"
import { Plus } from "lucide-react"
import { FormProvider, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { FetchBaseQueryError } from "@reduxjs/toolkit/query"
import { toast } from "sonner"
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

import {
  questionSchema,
  QuestionFormValues,
  defaultQuestionValues,
} from "./question.schema"

import {
  QuestionType,
  useCreateQuestionMutation,
} from "@/app/redux/api/questionsApi"

export default function CreateQuestionDialog() {
  const [open, setOpen] = useState(false)
  const [createQuestion, { isLoading }] = useCreateQuestionMutation()
  const methods = useForm<QuestionFormValues>({
    resolver: zodResolver(questionSchema),
    defaultValues: defaultQuestionValues,
  })

  async function onSubmit(values: QuestionFormValues) {
    try {
      await createQuestion({
        subjectId: values.subjectId,
        chapterId: values.chapterId,
        topicId: values.topicId,

        questionText: values.questionText,
        questionImage: values.questionImage,

        options: values.options,

        explanation: values.explanation,
        explanationImage: values.explanationImage,

        difficulty: values.difficulty,

        type: QuestionType.MCQ,

        tags: values.tags,

        sources: values.sources,
      }).unwrap()

      toast.success("Question created successfully.")

      methods.reset(defaultQuestionValues)

      setOpen(false)
    } catch (err) {
      const error = err as FetchBaseQueryError & {
        data?: {
          message?: string
        }
      }

      toast.error(error.data?.message ?? "Failed to create question.")
    }
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
          <QuestionForm onSubmit={onSubmit} isLoading={isLoading} />
        </FormProvider>
      </DialogContent>
    </Dialog>
  )
}
