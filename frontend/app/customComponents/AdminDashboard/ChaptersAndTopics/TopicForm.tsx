"use client"

import { useEffect, useState, ChangeEvent } from "react"
import { Controller, SubmitHandler, useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
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
import { IChapter, useGetChaptersQuery } from "@/app/redux/api/chaptersApi"
import {
  ITopic,
  TopicStatus,
  CreateTopicPayload,
  useCreateTopicMutation,
  useCreateBulkTopicMutation,
  useUpdateTopicMutation,
} from "@/app/redux/api/topicsApi"
import { useGetSubjectsQuery } from "@/app/redux/api/subjectsApi"

const topicSchema = z.object({
  subjectId: z.string().min(1, "Subject required"),
  chapterId: z.string().min(1, "Chapter required"),
  title: z.string().min(2, "Topic title required"),
  slug: z.string().min(2, "Slug required"),
  order: z.number().min(0, "Order must be 0 or greater"),
  status: z.nativeEnum(TopicStatus),
})

type TopicFormValues = z.infer<typeof topicSchema>

interface Props {
  mode: "create" | "edit"
  topic?: ITopic
  chapter?: IChapter
  onSuccess?: () => void
}

const generateSlug = (value: string) =>
  value
    .normalize("NFKC")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\p{L}\p{M}\p{N}-]/gu, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")

const parseBulk = (
  text: string,
  subjectId: string,
  chapterId: string,
  status: TopicStatus
): CreateTopicPayload[] =>
  text
    .split("|")
    .map((item) => item.trim())
    .filter(Boolean)
    .map((title, index) => ({
      subjectId,
      chapterId,
      title,
      slug: generateSlug(title),
      order: index + 1,
      status,
    }))

export default function TopicForm({ mode, topic, chapter, onSuccess }: Props) {
  const { data: chapters } = useGetChaptersQuery()
  const [bulkMode, setBulkMode] = useState(false)
  const [bulkText, setBulkText] = useState("")

  const [createTopic, { isLoading: createLoading }] = useCreateTopicMutation()

  const [createBulkTopic, { isLoading: bulkLoading }] =
    useCreateBulkTopicMutation()

  const [updateTopic, { isLoading: updateLoading }] = useUpdateTopicMutation()

  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    setValue,
    formState: { errors },
  } = useForm<TopicFormValues>({
    resolver: zodResolver(topicSchema),

    defaultValues: {
      subjectId:
        typeof chapter?.subjectId === "string"
          ? chapter.subjectId
          : (chapter?.subjectId?._id ?? ""),
      chapterId: chapter?._id ?? "",
      title: "",
      slug: "",
      order: 0,
      status: TopicStatus.DRAFT,
    },
  })

  const { data: subjects } = useGetSubjectsQuery()
  const subjectId = watch("subjectId")
  const chapterId = watch("chapterId")
  const status = watch("status")

  useEffect(() => {
    if (mode === "edit" && topic) {
      reset({
        subjectId:
          typeof topic.subjectId === "string"
            ? topic.subjectId
            : topic.subjectId._id,

        chapterId:
          typeof topic.chapterId === "string"
            ? topic.chapterId
            : topic.chapterId._id,

        title: topic.title,
        slug: topic.slug,
        order: topic.order,
        status: topic.status,
      })
    }

    if (mode === "create" && chapter) {
      const subject =
        typeof chapter.subjectId === "string"
          ? chapter.subjectId
          : chapter.subjectId._id

      setValue("subjectId", subject)
      setValue("chapterId", chapter._id)
    }
  }, [mode, topic, chapter, reset, setValue])

  const handleTitleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value

    setValue("title", title, {
      shouldDirty: true,
      shouldValidate: true,
    })

    setValue("slug", generateSlug(title), {
      shouldDirty: true,
      shouldValidate: true,
    })
  }

  const isSaving = createLoading || updateLoading || bulkLoading

  const submitBulk = async () => {
    if (!subjectId) {
      alert("Please select a subject.")
      return
    }

    if (!chapterId) {
      alert("Please select a chapter.")
      return
    }

    if (!bulkText.trim()) {
      alert("Please enter at least one topic.")
      return
    }

    const payload = parseBulk(bulkText, subjectId, chapterId, status)

    const invalidItems = payload.filter(
      (item) => !item.slug || item.slug === "-"
    )

    if (invalidItems.length > 0) {
      alert(
        `Invalid slug generated for:\n\n${invalidItems
          .map((item) => item.title)
          .join("\n")}`
      )
      return
    }

    const slugMap = new Map<string, string[]>()

    for (const item of payload) {
      const existing = slugMap.get(item.slug) ?? []

      existing.push(item.title)

      slugMap.set(item.slug, existing)
    }

    const duplicates = [...slugMap.entries()].filter(
      ([, titles]) => titles.length > 1
    )

    if (duplicates.length > 0) {
      alert(
        duplicates
          .map(([slug, titles]) => `${slug} : ${titles.join(" / ")}`)
          .join("\n")
      )

      return
    }

    try {
      await createBulkTopic(payload).unwrap()

      reset()

      setBulkMode(false)
      setBulkText("")

      onSuccess?.()
    } catch (error) {
      console.error(error)
    }
  }

  const submitSingle: SubmitHandler<TopicFormValues> = async (values) => {
    try {
      if (mode === "create") {
        await createTopic(values).unwrap()
      }

      if (mode === "edit" && topic) {
        await updateTopic({
          id: topic._id,
          data: values,
        }).unwrap()
      }

      reset()

      onSuccess?.()
    } catch (error) {
      console.error("Topic save failed:", error)
    }
  }

  const filteredChapters =
    chapters?.data?.filter((chapter) => {
      const id =
        typeof chapter.subjectId === "string"
          ? chapter.subjectId
          : chapter.subjectId._id

      return id === subjectId
    }) ?? []

  return (
    <form
      className="space-y-5"
      onSubmit={
        bulkMode
          ? (e) => {
              e.preventDefault()
              void submitBulk()
            }
          : handleSubmit(submitSingle)
      }
    >
      {mode === "create" && (
        <div className="flex gap-2">
          <Button
            type="button"
            variant={!bulkMode ? "default" : "outline"}
            onClick={() => {
              setBulkMode(false)
              setBulkText("")
              reset()
            }}
          >
            Single Topic
          </Button>

          <Button
            type="button"
            variant={bulkMode ? "default" : "outline"}
            onClick={() => {
              setBulkMode(true)
              setBulkText("")
              reset()
            }}
          >
            Bulk Topics
          </Button>
        </div>
      )}
      <div className="flex items-center gap-3 space-y-2">
        <label className="text-sm font-medium">Subject </label>

        <Controller
          name="subjectId"
          control={control}
          render={({ field }) => (
            <Select
              value={field.value}
              onValueChange={(value) => {
                field.onChange(value)

                // Reset chapter when subject changes
                setValue("chapterId", "")
              }}
              disabled={mode === "edit"}
            >
              <SelectTrigger className="w-full">
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

      <div className="flex w-full gap-8">
        <div className="flex items-center gap-3 space-y-2 w-7/12">
          <label className="text-sm font-medium">Chapter</label>

          <Controller
            name="chapterId"

            control={control}
            render={({ field }) => (
              <Select
                value={field.value}
                onValueChange={field.onChange}
                disabled={!subjectId || mode === "edit"}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Chapter" />
                </SelectTrigger>

                <SelectContent>
                  {filteredChapters.map((chapter) => (
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
        <div className="flex items-center gap-3 space-y-2 w-5/12">
          <label className="text-sm font-medium">Status</label>

          <Controller
            name="status"
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>

                <SelectContent className="w-full">
                  <SelectItem value={TopicStatus.DRAFT}>Draft</SelectItem>

                  <SelectItem value={TopicStatus.APPROVED}>Approved</SelectItem>
                </SelectContent>
              </Select>
            )}
          />

          {errors.status && (
            <p className="text-sm text-red-500">{errors.status.message}</p>
          )}
        </div>
      </div>
      {/* Chapter */}

      {!bulkMode && (
        <div className="space-y-5">
          {/* Title */}

          <div className="space-y-2">
            <label className="text-sm font-medium">Topic Title</label>

            <Input
              {...register("title")}
              placeholder="Linear Equation"
              onChange={handleTitleChange}
            />

            {errors.title && (
              <p className="text-sm text-red-500">{errors.title.message}</p>
            )}
          </div>

          {/* Slug */}

          <div className="space-y-2">
            <label className="text-sm font-medium">Slug</label>

            <Input {...register("slug")} placeholder="linear-equation" />

            {errors.slug && (
              <p className="text-sm text-red-500">{errors.slug.message}</p>
            )}
          </div>

          {/* Order */}

          <div className="space-y-2">
            <label className="text-sm font-medium">Order</label>

            <Input
              type="number"
              {...register("order", {
                valueAsNumber: true,
              })}
            />

            {errors.order && (
              <p className="text-sm text-red-500">{errors.order.message}</p>
            )}
          </div>
        </div>
      )}

      {bulkMode && (
        <div className="space-y-3">
          <label className="text-sm font-medium">Topics</label>

          <Textarea
            rows={10}
            value={bulkText}
            onChange={(e) => setBulkText(e.target.value)}
            placeholder="Linear Equation|Quadratic Equation|Simultaneous Equation|Algebraic Expression"
          />

          <p className="text-xs text-muted-foreground">
            Separate topics using <strong>|</strong>.
          </p>

          {bulkText.trim() && (
            <div className="rounded-md border p-4">
              <p className="mb-3 text-sm font-medium">
                Preview (
                {
                  bulkText
                    .split("|")
                    .map((item) => item.trim())
                    .filter(Boolean).length
                }{" "}
                topics)
              </p>

              <ul className="flex flex-wrap space-y-2">
                {bulkText
                  .split("|")
                  .map((item) => item.trim())
                  .filter(Boolean)
                  .map((item, index) => {
                    const slug = generateSlug(item)

                    return (
                      <li
                        key={`${item}-${index}`}
                        className="flex flex-col rounded border p-2"
                      >
                        <span>
                          {index + 1}. {item}
                        </span>

                        <span className="text-xs text-muted-foreground">
                          slug: {slug || "INVALID SLUG"}
                        </span>
                      </li>
                    )
                  })}
              </ul>
            </div>
          )}
        </div>
      )}

      <Button type="submit" disabled={isSaving} className="w-full">
        {isSaving
          ? "Saving..."
          : bulkMode
            ? "Create Topics"
            : mode === "create"
              ? "Create Topic"
              : "Update Topic"}
      </Button>
    </form>
  )
}
