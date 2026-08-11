"use client"

import { useEffect } from "react"
import { FormProvider, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

import QuestionForm from "./QuestionForm"
import { QuestionFormValues, questionSchema } from "./question.schema"

import {
  IEntityRef,
  IQuestion,
  QuestionDifficulty,
  QuestionStatus,
  useGetQuestionQuery,
  useUpdateQuestionMutation,
} from "@/app/redux/api/questionsApi"

interface Props {
  questionId: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

const getId = (value: string | IEntityRef | null | undefined) => {
  if (!value) return ""

  return typeof value === "string" ? value : value._id
}

const mapQuestionToForm = (question: IQuestion): QuestionFormValues => ({
  subjectId: getId(question.subjectId),
  chapterId: getId(question.chapterId),
  topicId: getId(question.topicId),

  questionText: question.questionText,
  questionImage: question.questionImage ?? null,

  options:
    question.options?.map((option) => ({
      text: option.text,
      image: option.image ?? null,
      isCorrect: option.isCorrect ?? false,
    })) ?? [],

  explanation: question.explanation ?? "",
  explanationImage: question.explanationImage ?? null,

  difficulty: question.difficulty ?? QuestionDifficulty.EASY,

  tags: question.tags ?? [],

  sources: question.sources ?? [],

  status: question.status ?? QuestionStatus.PENDING,
})

export default function EditQuestionDialog({
  questionId,
  open,
  onOpenChange,
}: Props) {
  const methods = useForm<QuestionFormValues>({
    resolver: zodResolver(questionSchema),

    defaultValues: {
      subjectId: "",
      chapterId: "",
      topicId: "",

      questionText: "",
      questionImage: null,

      options: [
        {
          text: "",
          image: null,
          isCorrect: true,
        },
        {
          text: "",
          image: null,
          isCorrect: false,
        },
        {
          text: "",
          image: null,
          isCorrect: false,
        },
        {
          text: "",
          image: null,
          isCorrect: false,
        },
      ],

      explanation: "",
      explanationImage: null,

      difficulty: QuestionDifficulty.EASY,

      tags: [],

      sources: [],

      status: QuestionStatus.PENDING,
    },
  })

  const { data, currentData, isLoading, isFetching } = useGetQuestionQuery(
    questionId,
    {
      skip: !questionId || !open,
    }
  )

  const question = currentData?.data ?? data?.data

  const [updateQuestion, { isLoading: isUpdating }] =
    useUpdateQuestionMutation()

  useEffect(() => {
    if (!open) return
    if (!question) return

    methods.reset(mapQuestionToForm(question))
  }, [open, question, methods])

  async function handleSubmit(values: QuestionFormValues) {
    try {
      await updateQuestion({
        id: questionId,

        data: {
          subjectId: values.subjectId,
          chapterId: values.chapterId,
          topicId: values.topicId,

          questionText: values.questionText,
          questionImage: values.questionImage,

          options: values.options,

          explanation: values.explanation,
          explanationImage: values.explanationImage,

          difficulty: values.difficulty,

          tags: values.tags,

          sources: values.sources,

          status: values.status,
        },
      }).unwrap()

      toast.success("Question updated successfully")

      onOpenChange(false)
    } catch (error: unknown) {
      const message =
        error && typeof error === "object" && "data" in error
          ? (error.data as { message?: string })?.message
          : undefined

      toast.error(message ?? "Failed to update question")
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-3xl min-w-[70%] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Question</DialogTitle>

          <DialogDescription>Update question information.</DialogDescription>
        </DialogHeader>

        {isLoading || isFetching || !question ? (
          <div className="flex h-40 items-center justify-center">
            Loading...
          </div>
        ) : (
          <FormProvider {...methods}>
            <QuestionForm
              mode="edit"
              isLoading={isUpdating}
              onSubmit={handleSubmit}
            />
          </FormProvider>
        )}
      </DialogContent>
    </Dialog>
  )
}
