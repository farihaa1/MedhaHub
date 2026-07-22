"use client"

import { useEffect } from "react"
import { useForm, Controller } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
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
import {
  ChapterStatus,
  IChapter,
  useCreateChapterMutation,
  useUpdateChapterMutation,
} from "@/app/redux/api/chaptersApi"

const chapterSchema = z.object({
  subjectId: z.string().min(1, "Subject required"),

  title: z.string().min(2, "Chapter title required"),

  slug: z.string().min(2, "Slug required"),

  order: z.number().min(0),

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
  const { data: subjects } = useGetSubjectsQuery(undefined)

  const [createChapter, { isLoading: creating }] = useCreateChapterMutation()

  const [updateChapter, { isLoading: updating }] = useUpdateChapterMutation()

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    control,
    formState: { errors },
  } = useForm<ChapterFormValues>({
    resolver: zodResolver(chapterSchema),

    defaultValues: {
      subjectId: "",

      title: "",

      slug: "",

      order: 0,

      status: ChapterStatus.DRAFT,
    },
  })

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
}, [mode, chapter, reset])
  const generateSlug = (value: string) => {
    return value
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]+/g, "")
  }

  async function onSubmit(values: ChapterFormValues) {
    try {
      if (mode === "create") {
        await createChapter(values).unwrap()
      }

      if (mode === "edit" && chapter) {
        await updateChapter({
          id: chapter._id,

          data: values,
        }).unwrap()
      }

      reset()

      onSuccess?.()
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* Subject */}

      <div>
        <label className="text-sm font-medium">Subject</label>

        <Controller
          name="subjectId"

          control={control}

          render={({ field }) => (
            <Select
              value={field.value}

              onValueChange={field.onChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select subject" />
              </SelectTrigger>

              <SelectContent>
                {subjects?.data?.map((subject: SubjectOption) => (
                  <SelectItem
                    key={subject._id}

                    value={subject._id}
                  >
                    {subject.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />

        <p className="text-sm text-red-500">{errors.subjectId?.message}</p>
      </div>

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

      {/* Status */}

      <div>
        <label className="text-sm font-medium">Status</label>

        <Controller
          name="status"

          control={control}

          render={({ field }) => (
            <Select
              value={field.value}

              onValueChange={field.onChange}
            >
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

      <Button
        disabled={creating || updating}

        type="submit"

        className="w-full"
      >
        {creating || updating
          ? "Saving..."
          : mode === "create"
            ? "Create Chapter"
            : "Update Chapter"}
      </Button>
    </form>
  )
}
