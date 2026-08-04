"use client"

import { Controller, useFormContext, useWatch } from "react-hook-form"

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
    resetField,
    formState: { errors },
  } = useFormContext<QuestionFormValues>()

  const subjectId = useWatch({
    control,
    name: "subjectId",
  })

  const chapterId = useWatch({
    control,
    name: "chapterId",
  })

  const { data: subjects, isLoading: subjectsLoading } = useGetSubjectsQuery()

  const { data: chapters, isLoading: chaptersLoading } =
    useGetChaptersBySubjectQuery(subjectId!, {
      skip: !subjectId,
    })

  const { data: topics, isLoading: topicsLoading } = useGetTopicsByChapterQuery(
    chapterId!,
    {
      skip: !chapterId,
    }
  )

  return (
    <div className="space-y-4 p-6">
      <div className="grid gap-3 md:grid-cols-3">
        {/* Subject */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Subject</label>

          <Controller
            control={control}
            name="subjectId"
            render={({ field }) => (
              <Select
                value={field.value ?? ""}
                onValueChange={(value) => {
                  field.onChange(value)
                  resetField("chapterId")
                  resetField("topicId")
                }}
              >
                <SelectTrigger className="min-w-3/12">
                  <SelectValue
                    placeholder={
                      subjectsLoading ? "Loading subjects..." : "Select Subject"
                    }
                  />
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
            control={control}
            name="chapterId"
            render={({ field }) => (
              <Select
                disabled={!subjectId || chaptersLoading}
                value={field.value ?? ""}
                onValueChange={(value) => {
                  field.onChange(value)
                  resetField("topicId")
                }}
              >
                <SelectTrigger className="min-w-3/12">
                  <SelectValue
                    placeholder={
                      !subjectId
                        ? "Select Subject First"
                        : chaptersLoading
                          ? "Loading chapters..."
                          : "Select Chapter"
                    }
                  />
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
            control={control}
            name="topicId"
            render={({ field }) => (
              <Select
                disabled={!chapterId || topicsLoading}
                value={field.value ?? ""}
                onValueChange={field.onChange}
              >
                <SelectTrigger className="min-w-3/12">
                  <SelectValue
                    placeholder={
                      !chapterId
                        ? "Select Chapter First"
                        : topicsLoading
                          ? "Loading topics..."
                          : "Select Topic"
                    }
                  />
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
