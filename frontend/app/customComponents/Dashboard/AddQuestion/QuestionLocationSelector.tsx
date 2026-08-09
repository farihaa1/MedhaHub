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

import { BookOpen, FolderTree, ListTree, Plus } from "lucide-react"

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

export default function QuestionLocationSelector({ value, onChange }: Props) {
  const [chapterMode, setChapterMode] = useState<"existing" | "new">("existing")

  const [topicMode, setTopicMode] = useState<"existing" | "new">("existing")

  const { control, setValue } = useForm({
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

  const { data: subjectsData, isLoading: subjectLoading } =
    useGetSubjectsQuery()

  const { data: chaptersData, isLoading: chapterLoading } =
    useGetChaptersBySubjectQuery(subjectId || skipToken)

  const { data: topicsData, isLoading: topicLoading } =
    useGetTopicsByChapterQuery(chapterId || skipToken)

  const updateLocation = (data: Partial<QuestionLocation>) => {
    onChange({
      ...value,
      ...data,
    })
  }

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {/* SUBJECT */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <BookOpen className="size-4" />
          </div>

          <div>
            <label className="text-xs font-semibold">বিষয়</label>

            <p className="text-xs text-muted-foreground">
              প্রশ্নের বিষয় নির্বাচন করুন
            </p>
          </div>
        </div>

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
                  suggestedChapterTitle: "",
                  suggestedTopicTitle: "",
                })
              }}
            >
              <SelectTrigger className="h-11 w-full">
                <SelectValue placeholder="বিষয় নির্বাচন করুন" />
              </SelectTrigger>

              <SelectContent>
                {subjectLoading ? (
                  <SelectItem value="loading" disabled>
                    বিষয় লোড হচ্ছে...
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
      </div>

      {/* CHAPTER */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <FolderTree className="size-4" />
          </div>

          <div>
            <label className="text-xs font-semibold">অধ্যায়</label>

            <p className="text-xs text-muted-foreground">
              অধ্যায় নির্বাচন বা প্রস্তাব করুন
            </p>
          </div>
        </div>

        <div className="flex rounded-lg border bg-muted/40 p-1">
          <Button
            type="button"
            size="sm"
            variant={chapterMode === "existing" ? "default" : "ghost"}
            className="flex-1"
            onClick={() => {
              setChapterMode("existing")

              updateLocation({
                suggestedChapterTitle: "",
              })
            }}
          >
            বিদ্যমান
          </Button>

          <Button
            type="button"
            size="sm"
            variant={chapterMode === "new" ? "default" : "ghost"}
            className="flex-1 gap-1"
            onClick={() => {
              setChapterMode("new")

              setValue("chapterId", "")

              updateLocation({
                chapterId: "",
                topicId: "",
                suggestedChapterTitle: "",
              })
            }}
          >
            <Plus className="size-3.5" />
            নতুন
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
                    suggestedTopicTitle: "",
                  })
                }}
              >
                <SelectTrigger className="h-11 w-full">
                  <SelectValue
                    placeholder={
                      !subjectId
                        ? "প্রথমে বিষয় নির্বাচন করুন"
                        : chapterLoading
                          ? "অধ্যায় লোড হচ্ছে..."
                          : "অধ্যায় নির্বাচন করুন"
                    }
                  />
                </SelectTrigger>

                <SelectContent>
                  {chaptersData?.data?.length ? (
                    chaptersData.data.map((chapter) => (
                      <SelectItem key={chapter._id} value={chapter._id}>
                        {chapter.title}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="none" disabled>
                      কোনো অধ্যায় পাওয়া যায়নি
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            )}
          />
        ) : (
          <Input
            className="h-11"
            placeholder="নতুন অধ্যায়ের নাম লিখুন"
            value={value.suggestedChapterTitle || ""}
            onChange={(e) =>
              updateLocation({
                suggestedChapterTitle: e.target.value,
              })
            }
          />
        )}
      </div>

      {/* TOPIC */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <ListTree className="size-4" />
          </div>

          <div>
            <label className="text-sm font-semibold">টপিক</label>

            <p className="text-xs text-muted-foreground">
              টপিক নির্বাচন বা প্রস্তাব করুন
            </p>
          </div>
        </div>

        <div className="flex rounded-lg border bg-muted/40 p-1">
          <Button
            type="button"
            size="sm"
            variant={topicMode === "existing" ? "default" : "ghost"}
            className="flex-1"
            onClick={() => {
              setTopicMode("existing")

              updateLocation({
                suggestedTopicTitle: "",
              })
            }}
          >
            বিদ্যমান
          </Button>

          <Button
            type="button"
            size="sm"
            variant={topicMode === "new" ? "default" : "ghost"}
            className="flex-1 gap-1"
            onClick={() => {
              setTopicMode("new")

              setValue("topicId", "")

              updateLocation({
                topicId: "",
                suggestedTopicTitle: "",
              })
            }}
          >
            <Plus className="size-3.5" />
            নতুন
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
                <SelectTrigger className="h-11 w-full">
                  <SelectValue
                    placeholder={
                      !chapterId
                        ? "প্রথমে অধ্যায় নির্বাচন করুন"
                        : topicLoading
                          ? "টপিক লোড হচ্ছে..."
                          : "টপিক নির্বাচন করুন"
                    }
                  />
                </SelectTrigger>

                <SelectContent>
                  {topicsData?.data?.length ? (
                    topicsData.data.map((topic) => (
                      <SelectItem key={topic._id} value={topic._id}>
                        {topic.title}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="none" disabled>
                      কোনো টপিক পাওয়া যায়নি
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            )}
          />
        ) : (
          <Input
            className="h-11"
            placeholder="নতুন টপিকের নাম লিখুন"
            value={value.suggestedTopicTitle || ""}
            onChange={(e) =>
              updateLocation({
                suggestedTopicTitle: e.target.value,
              })
            }
          />
        )}
      </div>
    </div>
  )
}
