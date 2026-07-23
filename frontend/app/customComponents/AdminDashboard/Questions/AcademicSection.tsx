"use client"

import { Controller, useFormContext } from "react-hook-form"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { QuestionFormValues } from "./question.schema"

import { useGetSubjectsQuery } from "@/app/redux/api/subjectsApi"
import { useGetChaptersBySubjectQuery } from "@/app/redux/api/chaptersApi"
import { useGetTopicsByChapterQuery } from "@/app/redux/api/topicsApi"

export default function AcademicSection() {
  const {
    control,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<QuestionFormValues>()

  const subjectId = watch("subjectId")
  const chapterId = watch("chapterId")

  const { data: subjects } = useGetSubjectsQuery()

  const { data: chapters } = useGetChaptersBySubjectQuery(subjectId, {
    skip: !subjectId,
  })

  const { data: topics } = useGetTopicsByChapterQuery(chapterId, {
    skip: !chapterId,
  })

  return (
    <div className="space-y-6 rounded-xl border bg-card p-6">
      <div>
        <h2 className="text-lg font-semibold">Academic Information</h2>

        <p className="text-sm text-muted-foreground">
          Select subject, chapter and topic.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {/* Subject */}

        <div className="space-y-2">
          <label className="text-sm font-medium">Subject</label>

          <Controller
            name="subjectId"
            control={control}
            render={({ field }) => (
              <Select
                value={field.value}
                onValueChange={(value) => {
                  field.onChange(value)

                  setValue("chapterId", "")

                  setValue("topicId", "")
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Subject" />
                </SelectTrigger>

                <SelectContent>
                  {subjects?.data?.map((subject) => (
                    <SelectItem key={subject._id} value={subject._id}>
                      {subject.title}
                    </SelectItem>
                  ))}
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
          <label className="text-sm font-medium">Chapter</label>

          <Controller
            name="chapterId"
            control={control}
            render={({ field }) => (
              <Select
                disabled={!subjectId}
                value={field.value}
                onValueChange={(value) => {
                  field.onChange(value)

                  setValue("topicId", "")
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Chapter" />
                </SelectTrigger>

                <SelectContent>
                  {chapters?.data?.map((chapter) => (
                    <SelectItem key={chapter._id} value={chapter._id}>
                      {chapter.title}
                    </SelectItem>
                  ))}
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
          <label className="text-sm font-medium">Topic</label>

          <Controller
            name="topicId"
            control={control}
            render={({ field }) => (
              <Select
                disabled={!chapterId}
                value={field.value}
                onValueChange={field.onChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Topic" />
                </SelectTrigger>

                <SelectContent>
                  {topics?.data?.map((topic) => (
                    <SelectItem key={topic._id} value={topic._id}>
                      {topic.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />

          {errors.topicId && (
            <p className="text-sm text-red-500">{errors.topicId.message}</p>
          )}
        </div>
      </div>
    </div>
  )
}
