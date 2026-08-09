
"use client"

import { useState } from "react"
import { useForm, useFieldArray, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { questionSchema, QuestionFormValues } from "./questionSchema"
import { QuestionLocation } from "./QuestionLocationSelector"

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

import { toast } from "sonner"

import { useCreateQuestionSubmissionMutation } from "@/app/redux/api/questionSubmissionApi"

const defaultOptions = [
  {
    label: "A" as const,
    text: "",
  },
  {
    label: "B" as const,
    text: "",
  },
  {
    label: "C" as const,
    text: "",
  },
  {
    label: "D" as const,
    text: "",
  },
]

interface Props {
  location: QuestionLocation
}

export default function QuestionCreateForm({ location }: Props) {
  const [tagInput, setTagInput] = useState("")

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<QuestionFormValues>({
    resolver: zodResolver(questionSchema),

    defaultValues: {
      questionText: "",
      options: defaultOptions,
      correctAnswer: "A",
      tags: [],
    },
  })

  const { fields } = useFieldArray({
    control,
    name: "options",
  })

  const [createSubmission] = useCreateQuestionSubmissionMutation()

  const onSubmit = async (data: QuestionFormValues) => {
    console.log("onSubmit called:", data)

    try {
      // Convert form options into the format expected by the API.
      //
      // Form:
      // {
      //   label: "A",
      //   text: "..."
      // }
      //
      // API:
      // {
      //   label: "A",
      //   text: "...",
      //   isCorrect: true/false
      // }

      const options = data.options.map((option) => ({
        label: option.label,
        text: option.text,
        isCorrect: option.label === data.correctAnswer,
      }))

      const payload = {
        subjectId: location.subjectId,

        chapterId: location.chapterId || undefined,

        topicId: location.topicId || undefined,

        suggestedChapterTitle:
          location.suggestedChapterTitle || undefined,

        suggestedTopicTitle:
          location.suggestedTopicTitle || undefined,

        questionText: data.questionText,

        options,

        correctAnswer: data.correctAnswer,

        tags: tagInput
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean),
      }

      console.log("Submission payload:", payload)

      const response = await createSubmission(payload).unwrap()

      console.log("Submission response:", response)

      toast.success("Question submitted for review")

      reset({
        questionText: "",
        options: defaultOptions,
        correctAnswer: "A",
        tags: [],
      })

      setTagInput("")
    } catch (error) {
      console.error("Question submission error:", error)

      toast.error("Failed to submit question")
    }
  }

  return (
    <form
      onSubmit={handleSubmit(
        onSubmit,
        (validationErrors) => {
          console.log(
            "Validation errors:",
            validationErrors
          )
        }
      )}
      className="space-y-6 rounded-xl border bg-card p-6 shadow-sm"
    >
      {/* QUESTION */}

      <div className="space-y-2">
        <label className="font-medium">
          Question
        </label>

        <Textarea
          placeholder="Enter question"
          {...register("questionText")}
          className="min-h-28 resize-y"
        />

        {errors.questionText && (
          <p className="text-sm text-red-500">
            {errors.questionText.message}
          </p>
        )}
      </div>

      {/* OPTIONS */}

      <div className="space-y-3">
        <label className="text-sm font-medium">
          Options
        </label>

        <div className="grid gap-4 pt-1 md:grid-cols-2">
          {fields.map((item, index) => (
            <div
              key={item.id}
              className="space-y-2"
            >
              <div className="flex items-center gap-2">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-muted text-sm font-semibold">
                  {item.label}
                </span>

                <Input
                  placeholder={`Option ${item.label}`}
                  {...register(
                    `options.${index}.text`
                  )}
                />
              </div>

              {errors.options?.[index]?.text && (
                <p className="text-sm text-red-500">
                  {
                    errors.options[index]?.text
                      ?.message
                  }
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ANSWER */}

      <div className="space-y-2">
        <label className="font-medium">
          Correct Answer
        </label>

        <Controller
          control={control}
          name="correctAnswer"
          render={({ field }) => (
            <Select
              value={field.value}
              onValueChange={field.onChange}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select correct answer" />
              </SelectTrigger>

              <SelectContent>
                {["A", "B", "C", "D"].map(
                  (option) => (
                    <SelectItem
                      key={option}
                      value={option}
                    >
                      Option {option}
                    </SelectItem>
                  )
                )}
              </SelectContent>
            </Select>
          )}
        />

        {errors.correctAnswer && (
          <p className="text-sm text-red-500">
            {errors.correctAnswer.message}
          </p>
        )}
      </div>

      {/* TAGS */}

      <div className="space-y-2">
        <label className="font-medium">
          Tags
        </label>

        <Input
          placeholder="BCS, SSC, HSC, NTRCA"
          value={tagInput}
          onChange={(e) =>
            setTagInput(e.target.value)
          }
        />

        <p className="text-xs text-muted-foreground">
          Separate tags using commas.
        </p>
      </div>

      {/* SUBMIT */}

      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting
            ? "Submitting..."
            : "Submit Question"}
        </Button>
      </div>
    </form>
  )
}
