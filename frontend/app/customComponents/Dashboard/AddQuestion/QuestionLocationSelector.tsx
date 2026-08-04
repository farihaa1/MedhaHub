"use client"
import { useEffect, useState } from "react"
import { Controller, useForm, useWatch } from "react-hook-form"
import { skipToken } from "@reduxjs/toolkit/query"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { useGetSubjectsQuery } from "@/app/redux/api/subjectsApi"
import { useGetChaptersBySubjectQuery } from "@/app/redux/api/chaptersApi"
import { useGetTopicsByChapterQuery } from "@/app/redux/api/topicsApi"

export interface QuestionLocation {
  subjectId: string

  chapterId?: string

  topicId?: string

  suggestedChapterTitle?: string

  suggestedTopicTitle?: string
}

interface Props {
  value: QuestionLocation

  onChange: (value: QuestionLocation) => void
}

export default function QuestionLocationSelector({
  value,

  onChange,
}: Props) {
  const [chapterMode, setChapterMode] = useState<"existing" | "new">("existing")

  const [topicMode, setTopicMode] = useState<"existing" | "new">("existing")

  const {
    control,

    setValue,
  } = useForm<QuestionLocation>({
    defaultValues: value,
  })

  useEffect(() => {
    setValue("subjectId", value.subjectId)

    setValue("chapterId", value.chapterId || "")

    setValue("topicId", value.topicId || "")
  }, [value, setValue])

  const subjectId = useWatch({
    control,

    name: "subjectId",
  })

  const chapterId = useWatch({
    control,

    name: "chapterId",
  })

  const {
    data: subjectsData,

    isLoading: subjectLoading,
  } = useGetSubjectsQuery()

  const {
    data: chaptersData,

    isLoading: chapterLoading,
  } = useGetChaptersBySubjectQuery(subjectId || skipToken)

  const {
    data: topicsData,

    isLoading: topicLoading,
  } = useGetTopicsByChapterQuery(chapterId || skipToken)

  const updateLocation = (data: Partial<QuestionLocation>) => {
    const updated = {
      ...value,

      ...data,
    }

    onChange(updated)
  }

  return (
    <div className="space-y-5 py-5">
      {/* SUBJECT */}

      <div className="space-y-2">
        <label className="text-sm font-medium">Subject</label>

        <Controller
          control={control}
          name="subjectId"
          render={({ field }) => (
            <Select
              value={field.value}
              onValueChange={(v) => {
                field.onChange(v)
                setValue("chapterId", "")
                setValue("topicId", "")
                updateLocation({
                  subjectId: v,
                  chapterId: "",
                  topicId: "",
                })
              }}
            >
              <SelectTrigger className="w-full text-sm">
                <SelectValue placeholder="Select Subject" />
              </SelectTrigger>

              <SelectContent>
                {subjectLoading ? (
                  <SelectItem value="loading" disabled>
                    Loading...
                  </SelectItem>
                ) : (
                  subjectsData?.data?.map((subject) => (
                    <SelectItem
                      key={subject._id}

                      value={subject._id}
                    >
                      {subject.title}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          )}
        />
      </div>

      {/* CHAPTER */}

      <div className="space-y-2">
        <label className="text-sm font-medium">Chapter</label>

        <div className="flex gap-2 pt-2">
          <Button
            type="button"
            size="xs"
            className="text-[8px]"
            variant={chapterMode === "existing" ? "default" : "outline"}

            onClick={() => {
              setChapterMode("existing")

              updateLocation({
                suggestedChapterTitle: "",
              })
            }}
          >
            Existing
          </Button>

          <Button
            type="button"
            size="xs"
            className="text-[8px]"
            variant={chapterMode === "new" ? "default" : "outline"}

            onClick={() => {
              setChapterMode("new")

              setValue("chapterId", "")

              updateLocation({
                chapterId: "",

                topicId: "",
              })
            }}
          >
            Suggest New
          </Button>
        </div>

        {chapterMode === "existing" ? (
          <Controller
            control={control}

            name="chapterId"

            render={({ field }) => (
              <Select
                value={field.value}

                disabled={!subjectId || chapterLoading}

                onValueChange={(v) => {
                  field.onChange(v)

                  updateLocation({
                    chapterId: v,

                    topicId: "",
                  })
                }}
              >
                <SelectTrigger className="w-full text-sm">
                  <SelectValue placeholder="Select Chapter" />
                </SelectTrigger>

                <SelectContent>
                  {chaptersData?.data?.map((chapter) => (
                    <SelectItem
                      key={chapter._id}

                      value={chapter._id}
                    >
                      {chapter.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        ) : (
          <Input
            placeholder="Enter new chapter name"

            onChange={(e) => {
              updateLocation({
                suggestedChapterTitle: e.target.value,
              })
            }}
          />
        )}
      </div>

      {/* TOPIC */}

      <div className="space-y-2">
        <label className="text-sm font-medium ">Topic</label>

        <div className="flex gap-2 pt-2">
          <Button
            type="button"
            size="xs"
            className="text-[8px]"
            variant={topicMode === "existing" ? "default" : "outline"}

            onClick={() => {
              setTopicMode("existing")

              updateLocation({
                suggestedTopicTitle: "",
              })
            }}
          >
            Existing
          </Button>

          <Button
            type="button"
            size="xs"
            className="text-[8px]"
            variant={topicMode === "new" ? "default" : "outline"}

            onClick={() => {
              setTopicMode("new")

              setValue("topicId", "")

              updateLocation({
                topicId: "",
              })
            }}
          >
            Suggest New
          </Button>
        </div>

        {topicMode === "existing" ? (
          <Controller
            control={control}

            name="topicId"

            render={({ field }) => (
              <Select
                value={field.value}

                disabled={!chapterId || topicLoading}

                onValueChange={(v) => {
                  field.onChange(v)

                  updateLocation({
                    topicId: v,
                  })
                }}
              >
                <SelectTrigger className="w-full text-sm">
                  <SelectValue placeholder="Select Topic" />
                </SelectTrigger>

                <SelectContent>
                  {topicsData?.data?.map((topic) => (
                    <SelectItem
                      key={topic._id}

                      value={topic._id}
                    >
                      {topic.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        ) : (
          <Input
            placeholder="Enter new topic name"

            onChange={(e) => {
              updateLocation({
                suggestedTopicTitle: e.target.value,
              })
            }}
          />
        )}
      </div>
    </div>
  )
}
