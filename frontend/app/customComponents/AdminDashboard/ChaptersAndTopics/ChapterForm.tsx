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

const chapterSchema = z.object({
  subjectId: z.string().min(1, "Subject required"),

  title: z.string().min(2, "Chapter title required"),

  slug: z.string().min(2, "Slug required"),

  order: z.number().min(1, "Order required"),

  status: z.nativeEnum(ChapterStatus),
})

type ChapterFormValues = z.infer<typeof chapterSchema>

interface Props {
  mode: "create" | "edit"
  chapter?: IChapter
  onSuccess?: () => void
}

interface SubjectOption {
  _id: string
  title: string
}

export default function ChapterForm({ mode, chapter, onSuccess }: Props) {
  const { data: subjects } = useGetSubjectsQuery()

  const [bulkMode, setBulkMode] = useState(false)

  const [bulkText, setBulkText] = useState("")

  const [createChapter, { isLoading: creating }] = useCreateChapterMutation()

  const [updateChapter, { isLoading: updating }] = useUpdateChapterMutation()

  const [createBulkChapter, { isLoading: bulkCreating }] =
    useCreateBulkChapterMutation()

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
const parseBulk = (text: string, subjectId: string, status: ChapterStatus) => {
  return text
    .split(/[\n,]+/) // split by comma OR new line
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
const status = watch("status")
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

  const generateSlug = (value: string) => {
    return value
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]/g, "")
  }

 const submitBulk = async () => {
   if (!subjectId) {
     alert("Please select a subject.")
     return
   }

   if (!bulkText.trim()) {
     alert("Please enter at least one chapter.")
     return
   }

   try {
     const payload = parseBulk(bulkText, subjectId, status)

     await createBulkChapter(payload).unwrap()

     reset()

     setBulkText("")

     setBulkMode(false)

     onSuccess?.()
   } catch (error) {
     console.error(error)
   }
 }
 
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
     console.error(error)
   }
 }

  return (
    <form
      onSubmit={
        bulkMode
          ? (e) => {
              e.preventDefault()
              submitBulk()
            }
          : handleSubmit(submitSingle)
      }
      className="space-y-5"
    >
      {mode === "create" && (
        <div className="grid grid-cols-2 gap-2">
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

      {/* Subject */}

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

        <p className="text-sm text-red-500">{errors.subjectId?.message}</p>
      </div>

      {!bulkMode && (
        <>
          {/* Title */}

          <div>
            <label className="text-sm font-medium">Chapter Title</label>

            <Input
              placeholder="Example: Algebra"
              {...register("title")}
              onChange={(e) => {
                setValue("title", e.target.value)

                setValue("slug", generateSlug(e.target.value))
              }}
            />

            <p className="text-sm text-red-500">{errors.title?.message}</p>
          </div>

          {/* Slug */}

          <div>
            <label className="text-sm font-medium">Slug</label>

            <Input {...register("slug")} />

            <p className="text-sm text-red-500">{errors.slug?.message}</p>
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

            <p className="text-sm text-red-500">{errors.order?.message}</p>
          </div>
        </>
      )}

      {/* Status */}

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
      </div>

      {bulkMode && (
        <div className="space-y-2">
          <label className="text-sm font-medium">Chapters</label>

          <Textarea
            rows={10}
            value={bulkText}
            onChange={(e) => setBulkText(e.target.value)}
            placeholder={`Algebra, Geometry, Calculus

or

Algebra
Geometry
Calculus`}
          />

          <p className="text-xs text-muted-foreground">
            Separate chapters with commas (,) or put one chapter per line. Slug
            and order will be generated automatically.
          </p>

          {bulkText.trim() && (
            <div className="rounded-md border p-3 text-sm">
              <p className="mb-2 font-medium">
                Preview ({bulkText.split(/[\n,]+/).filter(Boolean).length}{" "}
                chapters)
              </p>

              <ul className="list-disc space-y-1 pl-5">
                {bulkText
                  .split(/[\n,]+/)
                  .map((item) => item.trim())
                  .filter(Boolean)
                  .map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
              </ul>
            </div>
          )}
        </div>
      )}

      <Button
        type="submit"
        className="w-full"
        disabled={creating || updating || bulkCreating}
      >
        {creating || updating || bulkCreating
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
