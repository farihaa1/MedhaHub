"use client"

import { useEffect, useState } from "react"
import { Controller, useForm } from "react-hook-form"
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

import { useGetSubjectsQuery } from "@/app/redux/api/subjectsApi"

import {
  ChapterStatus,
  IChapter,
  useCreateBulkChapterMutation,
  useCreateChapterMutation,
  useUpdateChapterMutation,
} from "@/app/redux/api/chaptersApi"

// ============================================================
// Schema
// ============================================================

const chapterSchema = z.object({
  subjectId: z.string().min(1, "Subject required"),

  title: z.string().min(2, "Chapter title required"),

  slug: z.string().min(2, "Slug required"),

  order: z.number().min(1, "Order required"),

  status: z.nativeEnum(ChapterStatus),
})

type ChapterFormValues = z.infer<typeof chapterSchema>

// ============================================================
// Props
// ============================================================

interface Props {
  mode: "create" | "edit"
  chapter?: IChapter
  onSuccess?: () => void
}

interface SubjectOption {
  _id: string
  title: string
}

// ============================================================
// Slug generator
// ============================================================

/**
 * Generates a URL-safe slug.
 *
 * IMPORTANT:
 * Do NOT use:
 *
 *   /[^\w-]/g
 *
 * because \w only supports ASCII characters.
 *
 * This version supports:
 * - English
 * - Bengali
 * - Arabic
 * - Hindi
 * - Unicode letters in general
 *
 * Example:
 *
 * "Bangladesh Affairs" -> "bangladesh-affairs"
 * "বাংলাদেশ বিষয়াবলি" -> "বাংলাদেশ-বিষয়াবলি"
 * "আন্তর্জাতিক বিষয়াবলি" -> "আন্তর্জাতিক-বিষয়াবলি"
 */
const generateSlug = (value: string): string => {
  return (
    value
      .normalize("NFKC")
      .trim()
      .toLowerCase()
      // spaces -> hyphen
      .replace(/\s+/gu, "-")
      // Keep Unicode letters, Unicode marks, numbers and hyphens
      .replace(/[^\p{L}\p{M}\p{N}-]/gu, "")
      // Multiple hyphens -> one
      .replace(/-+/gu, "-")
      // Remove hyphens from beginning/end
      .replace(/^-+|-+$/gu, "")
  )
}

// ============================================================
// Bulk parser
// ============================================================

const parseBulk = (text: string, subjectId: string, status: ChapterStatus) => {
  return text
    .split("|")
    .map((item) => item.trim())
    .filter(Boolean)
    .map((title, index) => ({
      subjectId,
      title,
      slug: generateSlug(title),
      order: index + 1,
      status,
    }))
}

// ============================================================
// Component
// ============================================================

export default function ChapterForm({ mode, chapter, onSuccess }: Props) {
  const { data: subjects } = useGetSubjectsQuery()

  const [bulkMode, setBulkMode] = useState(false)

  const [bulkText, setBulkText] = useState("")

  const [createChapter, { isLoading: creating }] = useCreateChapterMutation()

  const [updateChapter, { isLoading: updating }] = useUpdateChapterMutation()

  const [createBulkChapter, { isLoading: bulkCreating }] =
    useCreateBulkChapterMutation()

  // ==========================================================
  // Form
  // ==========================================================

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    control,
    watch,
    formState: { errors },
  } = useForm<ChapterFormValues>({
    resolver: zodResolver(chapterSchema),

    defaultValues: {
      subjectId: "",
      title: "",
      slug: "",
      order: 1,
      status: ChapterStatus.DRAFT,
    },
  })

  const subjectId = watch("subjectId")
  const status = watch("status")

  // ==========================================================
  // Edit mode
  // ==========================================================

  useEffect(() => {
    if (mode === "edit" && chapter) {
      reset({
        subjectId:
          typeof chapter.subjectId === "string"
            ? chapter.subjectId
            : chapter.subjectId._id,

        title: chapter.title,

        slug: chapter.slug,

        order: chapter.order,

        status: chapter.status,
      })
    }
  }, [chapter, mode, reset])

  // ==========================================================
  // Single chapter title change
  // ==========================================================

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const title = event.target.value

    setValue("title", title, {
      shouldValidate: true,
      shouldDirty: true,
    })

    setValue("slug", generateSlug(title), {
      shouldValidate: true,
      shouldDirty: true,
    })
  }

  // ==========================================================
  // Bulk submit
  // ==========================================================

  const submitBulk = async () => {
    if (!subjectId) {
      alert("Please select a subject.")
      return
    }

    if (!bulkText.trim()) {
      alert("Please enter at least one chapter.")
      return
    }

    const payload = parseBulk(bulkText, subjectId, status)

    // ========================================================
    // Validate generated slugs before sending to backend
    // ========================================================

    const invalidItems = payload.filter(
      (item) => !item.slug || item.slug === "-"
    )

    if (invalidItems.length > 0) {
      alert(
        `Could not generate a valid slug for: ${invalidItems
          .map((item) => item.title)
          .join(", ")}`
      )

      return
    }

    // ========================================================
    // Detect duplicate slugs inside this bulk request
    // ========================================================

    const slugMap = new Map<string, string[]>()

    for (const item of payload) {
      const existing = slugMap.get(item.slug) ?? []

      existing.push(item.title)

      slugMap.set(item.slug, existing)
    }

    const duplicates = Array.from(slugMap.entries()).filter(
      ([, titles]) => titles.length > 1
    )

    if (duplicates.length > 0) {
      const duplicateMessage = duplicates
        .map(([slug, titles]) => `${slug}: ${titles.join(" / ")}`)
        .join("\n")

      alert(`Duplicate chapter slugs detected:\n\n${duplicateMessage}`)

      return
    }

    try {
      await createBulkChapter(payload).unwrap()

      reset()

      setBulkText("")

      setBulkMode(false)

      onSuccess?.()
    } catch (error) {
      console.error("Bulk chapter creation failed:", error)
    }
  }

  // ==========================================================
  // Single submit
  // ==========================================================

  const submitSingle = async (values: ChapterFormValues) => {
    try {
      if (mode === "create") {
        await createChapter(values).unwrap()
      } else if (chapter) {
        await updateChapter({
          id: chapter._id,
          data: values,
        }).unwrap()
      }

      reset()

      onSuccess?.()
    } catch (error) {
      console.error("Chapter save failed:", error)
    }
  }

  // ==========================================================
  // Loading
  // ==========================================================

  const isSaving = creating || updating || bulkCreating

  // ==========================================================
  // Render
  // ==========================================================

  return (
    <form
      onSubmit={
        bulkMode
          ? (event) => {
              event.preventDefault()
              void submitBulk()
            }
          : handleSubmit(submitSingle)
      }
      className="space-y-5"
    >
      {/* =====================================================
          Create mode: Single / Bulk
      ====================================================== */}

      {mode === "create" && (
        <div className="flex gap-2">
          <Button
            type="button"
            variant={!bulkMode ? "default" : "outline"}
            onClick={() => {
              setBulkMode(false)

              reset()

              setBulkText("")
            }}
          >
            Single Chapter
          </Button>

          <Button
            type="button"
            variant={bulkMode ? "default" : "outline"}
            onClick={() => {
              setBulkMode(true)

              reset()
            }}
          >
            Bulk Chapters
          </Button>
        </div>
      )}

      {/* =====================================================
          Subject
      ====================================================== */}

      <div>
        <label className="text-sm font-medium">Subject</label>

        <Controller
          name="subjectId"
          control={control}
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select Subject" />
              </SelectTrigger>

              <SelectContent>
                {subjects?.data?.map((subject: SubjectOption) => (
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

      {/* =====================================================
          SINGLE CHAPTER
      ====================================================== */}

      {!bulkMode && (
        <div className="flex flex-col">
          {/* Title */}

          <div>
            <label className="text-sm font-medium">Chapter Title</label>

            <Input
              placeholder="Example: Algebra"
              {...register("title")}
              onChange={handleTitleChange}
            />

            {errors.title && (
              <p className="text-sm text-red-500">{errors.title.message}</p>
            )}
          </div>

          {/* Slug */}

          <div>
            <label className="text-sm font-medium">Slug</label>

            <Input {...register("slug")} placeholder="chapter-slug" />

            {errors.slug && (
              <p className="text-sm text-red-500">{errors.slug.message}</p>
            )}
          </div>

          {/* Order */}

          <div>
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

      {/* =====================================================
          STATUS
      ====================================================== */}

      <div>
        <label className="text-sm font-medium">Status</label>

        <Controller
          name="status"
          control={control}
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value={ChapterStatus.DRAFT}>Draft</SelectItem>

                <SelectItem value={ChapterStatus.APPROVED}>Approved</SelectItem>
              </SelectContent>
            </Select>
          )}
        />

        {errors.status && (
          <p className="text-sm text-red-500">{errors.status.message}</p>
        )}
      </div>

      {/* =====================================================
          BULK MODE
      ====================================================== */}

      {bulkMode && (
        <div className="space-y-2">
          <label className="text-sm font-medium">Chapters</label>

          <Textarea
            rows={10}
            value={bulkText}
            onChange={(event) => setBulkText(event.target.value)}
            placeholder="Article|Proverbs|Sentence Correction|Conditional Sentence|Subject-Verb Agreement|Parts of Speech"
          />

          <p className="text-xs text-muted-foreground">
            Separate multiple chapters using <strong>|</strong> (pipe).
            <br />
            Example:
            <br />
            <span className="font-mono">
              Article|Proverbs|Sentence Correction|Conditional Sentence
            </span>
          </p>

          {bulkText.trim() && (
            <div className="rounded-md border p-3 text-sm">
              <p className="mb-3 font-medium">
                Preview (
                {
                  bulkText
                    .split("|")
                    .map((item) => item.trim())
                    .filter(Boolean).length
                }{" "}
                chapters)
              </p>

              <ul className="space-y-2">
                {bulkText
                  .split("|")
                  .map((item) => item.trim())
                  .filter(Boolean)
                  .map((item, index) => {
                    const slug = generateSlug(item)

                    return (
                      <li key={`${item}-${index}`} className="flex flex-col">
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

      {/* =====================================================
          Submit
      ====================================================== */}

      <Button type="submit" className="w-full" disabled={isSaving}>
        {isSaving
          ? "Saving..."
          : bulkMode
            ? "Create Chapters"
            : mode === "create"
              ? "Create Chapter"
              : "Update Chapter"}
      </Button>
    </form>
  )
}
