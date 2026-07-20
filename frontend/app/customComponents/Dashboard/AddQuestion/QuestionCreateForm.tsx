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
    console.log("onSubmit called", data)
    try {
      const payload = {
        subjectId: location.subjectId,

        chapterId: location.chapterId || undefined,

        topicId: location.topicId || undefined,

        suggestedChapterTitle: location.suggestedChapterTitle || undefined,

        suggestedTopicTitle: location.suggestedTopicTitle || undefined,

        questionText: data.questionText,

        options: data.options,

        correctAnswer: data.correctAnswer,

        tags: tagInput
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean),
      }

      const res = await createSubmission(payload).unwrap()
      console.log(res)
      toast.success("Question submitted for review")

      reset()

      setTagInput("")
    } catch (error) {
      console.log(error)

      toast.error("Failed to submit question")
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit, (errors) => {
        console.log("Validation errors:", errors)
      })}
      className="space-y-6 rounded-xl border p-6"
    >
      {/* QUESTION */}

      <div className="space-y-2">
        <label className="font-medium">Question</label>

        <Textarea
          placeholder="Enter question"

          {...register("questionText")}
        />

        {errors.questionText && (
          <p className="text-sm text-red-500">{errors.questionText.message}</p>
        )}
      </div>

      {/* OPTIONS */}

      <div className="space-y-3 text-sm">
        <label className="font-medium ">Options</label>

        <div className="grid gap-4 md:grid-cols-2 pt-1">
          {fields.map((item, index) => (
            <div key={item.id} className="space-y-2">
             
              <Input
                placeholder={`Option ${item.label}`}

                {...register(`options.${index}.text`)}
              />

              {errors.options?.[index]?.text && (
                <p className="text-sm text-red-500">
                  {errors.options[index]?.text?.message}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ANSWER */}

      <div className="space-y-2">
        <label className="font-medium">Correct Answer</label>

        <Controller
          control={control}
          name="correctAnswer"
          render={({ field }) => (
            <Select
              value={field.value}

              onValueChange={field.onChange}
            >
              <SelectTrigger className="w-full text-muted-foreground">
                <SelectValue />
              </SelectTrigger>

              <SelectContent className="text-muted-foreground">
                {["A", "B", "C", "D"].map((option) => (
                  <SelectItem
                    key={option}

                    value={option}
                  >
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
      </div>

      {/* TAGS */}

      <div className="space-y-2">
        <label className="font-medium">Tags</label>

        <Input
          placeholder="BCS, SSC, HSC, NTRCA"
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
        />

        <p className="text-xs text-muted-foreground">
          Separate tags using comma
        </p>
      </div>

      <Button type="submit" className="hover:scale-75" disabled={isSubmitting}>
        {isSubmitting ? "Submitting..." : "Submit Question"}
      </Button>
    </form>
  )
}
