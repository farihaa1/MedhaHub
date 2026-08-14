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

// =========================================================
// VALIDATION
// =========================================================

const topicSchema = z.object({
  subjectId: z.string().min(1, "বিষয় নির্বাচন করুন"),
  chapterId: z.string().min(1, "অধ্যায় নির্বাচন করুন"),
  title: z.string().min(2, "বিষয়ের নাম কমপক্ষে ২ অক্ষরের হতে হবে"),
  slug: z.string().min(2, "Slug আবশ্যক"),
  order: z.number().min(0, "ক্রম ০ বা তার বেশি হতে হবে"),
  status: z.nativeEnum(TopicStatus),
})

type TopicFormValues = z.infer<typeof topicSchema>

// =========================================================
// PROPS
// =========================================================

interface Props {
  mode: "create" | "edit"
  topic?: ITopic
  chapter?: IChapter
  onSuccess?: () => void
}

// =========================================================
// SLUG GENERATOR
// =========================================================

const generateSlug = (value: string) =>
  value
    .normalize("NFKC")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\p{L}\p{M}\p{N}-]/gu, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")

// =========================================================
// BULK PARSER
// =========================================================

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

// =========================================================
// COMPONENT
// =========================================================

export default function TopicForm({ mode, topic, chapter, onSuccess }: Props) {
  // =======================================================
  // API
  // =======================================================

  const { data: subjects, isLoading: subjectsLoading } = useGetSubjectsQuery()

  const { data: chapters, isLoading: chaptersLoading } = useGetChaptersQuery()

  const [createTopic, { isLoading: createLoading }] = useCreateTopicMutation()

  const [createBulkTopic, { isLoading: bulkLoading }] =
    useCreateBulkTopicMutation()

  const [updateTopic, { isLoading: updateLoading }] = useUpdateTopicMutation()

  // =======================================================
  // BULK STATE
  // =======================================================

  const [bulkMode, setBulkMode] = useState(false)
  const [bulkText, setBulkText] = useState("")

  // =======================================================
  // FORM
  // =======================================================

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
      subjectId: "",
      chapterId: "",
      title: "",
      slug: "",
      order: 0,
      status: TopicStatus.DRAFT,
    },
  })

  // =======================================================
  // WATCH
  // =======================================================

  const subjectId = watch("subjectId")
  const chapterId = watch("chapterId")
  const status = watch("status")

  // =======================================================
  // EDIT MODE
  // =======================================================

  useEffect(() => {
    if (mode !== "edit" || !topic) return

    const existingSubjectId =
      typeof topic.subjectId === "string"
        ? topic.subjectId
        : (topic.subjectId?._id ?? "")

    const existingChapterId =
      typeof topic.chapterId === "string"
        ? topic.chapterId
        : (topic.chapterId?._id ?? "")

    reset({
      subjectId: existingSubjectId,
      chapterId: existingChapterId,
      title: topic.title ?? "",
      slug: topic.slug ?? "",
      order: topic.order ?? 0,
      status: topic.status ?? TopicStatus.DRAFT,
    })
  }, [mode, topic, reset])

  // =======================================================
  // CREATE MODE WITH CHAPTER
  // =======================================================

  useEffect(() => {
    if (mode !== "create" || !chapter) return

    const existingSubjectId =
      typeof chapter.subjectId === "string"
        ? chapter.subjectId
        : (chapter.subjectId?._id ?? "")

    reset({
      subjectId: existingSubjectId,
      chapterId: chapter._id,
      title: "",
      slug: "",
      order: 0,
      status: TopicStatus.DRAFT,
    })
  }, [mode, chapter, reset])

  // =======================================================
  // FIND CURRENT SUBJECT
  // =======================================================

  const currentSubject = subjects?.data?.find(
    (subject) => subject._id === subjectId
  )

  // =======================================================
  // FILTER CHAPTERS
  // =======================================================

  const filteredChapters =
    chapters?.data?.filter((item) => {
      const itemSubjectId =
        typeof item.subjectId === "string"
          ? item.subjectId
          : (item.subjectId?._id ?? "")

      return itemSubjectId === subjectId
    }) ?? []

  // =======================================================
  // FIND CURRENT CHAPTER
  // =======================================================

  const currentChapter = filteredChapters.find((item) => item._id === chapterId)

  // =======================================================
  // TITLE → SLUG
  // =======================================================

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

  // =======================================================
  // LOADING
  // =======================================================

  const isSaving = createLoading || updateLoading || bulkLoading

  // =======================================================
  // BULK SUBMIT
  // =======================================================

  const submitBulk = async () => {
    if (!subjectId) {
      alert("দয়া করে বিষয় নির্বাচন করুন।")
      return
    }

    if (!chapterId) {
      alert("দয়া করে অধ্যায় নির্বাচন করুন।")
      return
    }

    if (!bulkText.trim()) {
      alert("কমপক্ষে একটি বিষয় লিখুন।")
      return
    }

    const payload = parseBulk(bulkText, subjectId, chapterId, status)

    const invalidItems = payload.filter(
      (item) => !item.slug || item.slug === "-"
    )

    if (invalidItems.length > 0) {
      alert(
        `নিচের বিষয়গুলোর Slug তৈরি করা যায়নি:\n\n${invalidItems
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
      console.error("Bulk topic creation failed:", error)
    }
  }

  // =======================================================
  // SINGLE SUBMIT
  // =======================================================

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

  // =======================================================
  // RENDER
  // =======================================================

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
      {/* ===================================================
          CREATE / BULK SWITCH
      =================================================== */}

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
            একক বিষয়
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
            একাধিক বিষয়
          </Button>
        </div>
      )}

      {/* ===================================================
          SUBJECT
      =================================================== */}

      <div className="space-y-2">
        <label className="text-sm font-medium">বিষয়</label>

        <Controller
          name="subjectId"
          control={control}
          render={({ field }) => (
            <Select
              value={field.value || undefined}
              onValueChange={(value) => {
                field.onChange(value)

                // শুধুমাত্র create mode-এ chapter reset হবে
                if (mode === "create") {
                  setValue("chapterId", "")
                }
              }}
              disabled={mode === "edit" || subjectsLoading}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="বিষয় নির্বাচন করুন">
                  {mode === "edit" && currentSubject
                    ? currentSubject.title
                    : undefined}
                </SelectValue>
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

      {/* ===================================================
          CHAPTER
      =================================================== */}

      <div className="space-y-2">
        <label className="text-sm font-medium">অধ্যায়</label>

        <Controller
          name="chapterId"
          control={control}
          render={({ field }) => (
            <Select
              value={field.value || undefined}
              onValueChange={field.onChange}
              disabled={!subjectId || mode === "edit" || chaptersLoading}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="অধ্যায় নির্বাচন করুন">
                  {mode === "edit" && currentChapter
                    ? currentChapter.title
                    : undefined}
                </SelectValue>
              </SelectTrigger>

              <SelectContent>
                {filteredChapters.map((item) => (
                  <SelectItem key={item._id} value={item._id}>
                    {item.title}
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

      {/* ===================================================
          STATUS
      =================================================== */}

      <div className="space-y-2">
        <label className="text-sm font-medium">স্ট্যাটাস</label>

        <Controller
          name="status"
          control={control}
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value={TopicStatus.DRAFT}>খসড়া</SelectItem>

                <SelectItem value={TopicStatus.APPROVED}>অনুমোদিত</SelectItem>
              </SelectContent>
            </Select>
          )}
        />

        {errors.status && (
          <p className="text-sm text-red-500">{errors.status.message}</p>
        )}
      </div>

      {/* ===================================================
          SINGLE TOPIC
      =================================================== */}

      {!bulkMode && (
        <div className="space-y-5">
          {/* TITLE */}

          <div className="space-y-2">
            <label className="text-sm font-medium">বিষয়ের নাম</label>

            <Input
              {...register("title")}
              placeholder="যেমন: সরল সমীকরণ"
              onChange={handleTitleChange}
            />

            {errors.title && (
              <p className="text-sm text-red-500">{errors.title.message}</p>
            )}
          </div>

          {/* SLUG */}

          <div className="space-y-2">
            <label className="text-sm font-medium">Slug</label>

            <Input {...register("slug")} placeholder="linear-equation" />

            {errors.slug && (
              <p className="text-sm text-red-500">{errors.slug.message}</p>
            )}
          </div>

          {/* ORDER */}

          <div className="space-y-2">
            <label className="text-sm font-medium">ক্রম</label>

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

      {/* ===================================================
          BULK TOPICS
      =================================================== */}

      {bulkMode && (
        <div className="space-y-3">
          <label className="text-sm font-medium">বিষয়সমূহ</label>

          <Textarea
            rows={10}
            value={bulkText}
            onChange={(e) => setBulkText(e.target.value)}
            placeholder="সরল সমীকরণ|দ্বিঘাত সমীকরণ|যুগপৎ সমীকরণ|বীজগাণিতিক রাশি"
          />

          <p className="text-xs text-muted-foreground">
            প্রতিটি বিষয় <strong>|</strong> চিহ্ন দিয়ে আলাদা করুন।
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
                টি বিষয়)
              </p>

              <ul className="flex flex-wrap gap-2">
                {bulkText
                  .split("|")
                  .map((item) => item.trim())
                  .filter(Boolean)
                  .map((item, index) => {
                    const slug = generateSlug(item)

                    return (
                      <li
                        key={`${item}-${index}`}
                        className="rounded border p-2"
                      >
                        <span>
                          {index + 1}. {item}
                        </span>

                        <span className="block text-xs text-muted-foreground">
                          slug: {slug || "অকার্যকর Slug"}
                        </span>
                      </li>
                    )
                  })}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* ===================================================
          SUBMIT
      =================================================== */}

      <Button type="submit" disabled={isSaving} className="w-full">
        {isSaving
          ? "সংরক্ষণ করা হচ্ছে..."
          : bulkMode
            ? "বিষয়সমূহ তৈরি করুন"
            : mode === "create"
              ? "বিষয় তৈরি করুন"
              : "পরিবর্তন সংরক্ষণ করুন"}
      </Button>
    </form>
  )
}
