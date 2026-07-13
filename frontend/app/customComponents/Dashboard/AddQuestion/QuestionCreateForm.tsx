"use client"

import { useEffect } from "react"

import { Controller, useFieldArray, useForm, useWatch } from "react-hook-form"

import { zodResolver } from "@hookform/resolvers/zod"

import { questionSchema, QuestionFormValues } from "./questionSchema"

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

import { useCreateQuestionMutation } from "@/app/redux/api/questionsApi"

import { useGetSubjectsQuery } from "@/app/redux/api/subjectsApi"

import { useGetChaptersBySubjectQuery } from "@/app/redux/api/chaptersApi"

import { useGetTopicsByChapterQuery } from "@/app/redux/api/topicsApi"

const defaultOptions = [
  { label: "A" as const, text: "" },
  { label: "B" as const, text: "" },
  { label: "C" as const, text: "" },
  { label: "D" as const, text: "" },
]

export default function QuestionCreateForm() {
  const {
    register,
    control,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<QuestionFormValues>({
    resolver: zodResolver(questionSchema),

    defaultValues: {
      subjectId: "",
      chapterId: "",
      topicId: "",
      questionText: "",
      options: defaultOptions,
      correctAnswer: "A",
    },
  })

  const { fields } = useFieldArray({
    control,
    name: "options",
  })
  const subjectId = useWatch({
    control,
    name: "subjectId",
  })

  const chapterId = useWatch({
    control,
    name: "chapterId",
  })
  const { data: subjectsData, isLoading: subjectsLoading } =
    useGetSubjectsQuery()

  const { data: chaptersData, isLoading: chaptersLoading } =
    useGetChaptersBySubjectQuery(subjectId, {
      skip: !subjectId,
    })
  const { data: topicsData, isLoading: topicsLoading } =
    useGetTopicsByChapterQuery(chapterId, {
      skip: !chapterId,
    })

  useEffect(() => {
    setValue("chapterId", "")
    setValue("topicId", "")
  }, [subjectId, setValue])

  useEffect(() => {
    setValue("topicId", "")
  }, [chapterId, setValue])
  const [createQuestion] = useCreateQuestionMutation()
  const onSubmit = async (data: QuestionFormValues) => {
    try {
      await createQuestion(data).unwrap()

      alert("Question Created")

      reset()
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 rounded-xl border bg-background p-6"
    >
      {/* Subject */}
      <div className="space-y-2">
        <label className="font-medium">Subject</label>

        <Controller
          control={control}
          name="subjectId"
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select Subject" />
              </SelectTrigger>

              <SelectContent>
                {subjectsLoading ? (
                  <SelectItem value="loading" disabled>
                    Loading...
                  </SelectItem>
                ) : (
                  subjectsData?.data?.map((subject) => (
                    <SelectItem key={subject._id} value={subject._id}>
                      {subject.title}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          )}
        />

        {errors.subjectId && (
          <p className="text-sm text-red-500">{errors.subjectId.message}</p>
        )}
      </div>

      {/* Chapter */}
      <div className="space-y-2">
        <label className="font-medium">Chapter</label>

        <Controller
          control={control}
          name="chapterId"
          render={({ field }) => (
            <Select
              value={field.value}
              onValueChange={field.onChange}
              disabled={!subjectId || chaptersLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Chapter" />
              </SelectTrigger>

              <SelectContent>
                {chaptersLoading ? (
                  <SelectItem value="loading" disabled>
                    Loading...
                  </SelectItem>
                ) : (
                  chaptersData?.data?.map((chapter) => (
                    <SelectItem key={chapter._id} value={chapter._id}>
                      {chapter.title}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          )}
        />

        {errors.chapterId && (
          <p className="text-sm text-red-500">{errors.chapterId.message}</p>
        )}
      </div>

      {/* Topic */}
      <div className="space-y-2">
        <label className="font-medium">Topic</label>

        <Controller
          control={control}
          name="topicId"
          render={({ field }) => (
            <Select
              value={field.value}
              onValueChange={field.onChange}
              disabled={!chapterId || topicsLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Topic" />
              </SelectTrigger>

              <SelectContent>
                {topicsLoading ? (
                  <SelectItem value="loading" disabled>
                    Loading...
                  </SelectItem>
                ) : (
                  topicsData?.data?.map((topic) => (
                    <SelectItem key={topic._id} value={topic._id}>
                      {topic.title}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          )}
        />

        {errors.topicId && (
          <p className="text-sm text-red-500">{errors.topicId.message}</p>
        )}
      </div>

      {/* Question */}
      <div className="space-y-2">
        <label className="font-medium">Question</label>

        <Textarea placeholder="Enter question" {...register("questionText")} />

        {errors.questionText && (
          <p className="text-sm text-red-500">{errors.questionText.message}</p>
        )}
      </div>

      {/* Options */}
      <div className="space-y-4">
        <label className="font-medium">Options</label>

        <div className="grid gap-4 md:grid-cols-2">
          {fields.map((item, index) => (
            <div key={item.id} className="space-y-2">
              <label>Option {item.label}</label>

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

      {/* Correct Answer */}
      <div className="space-y-2">
        <label className="font-medium">Correct Answer</label>

        <Controller
          control={control}
          name="correctAnswer"
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="A">A</SelectItem>
                <SelectItem value="B">B</SelectItem>
                <SelectItem value="C">C</SelectItem>
                <SelectItem value="D">D</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
      </div>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Creating..." : "Create Question"}
      </Button>
    </form>
  )
}
