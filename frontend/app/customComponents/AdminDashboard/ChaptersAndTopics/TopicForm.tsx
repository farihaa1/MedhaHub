"use client"

import { useEffect } from "react"
import { useForm, Controller } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { useGetChaptersQuery } from "@/app/redux/api/chaptersApi"

import {
  useCreateTopicMutation,
  useUpdateTopicMutation,
  TopicStatus,
  ITopic,
} from "@/app/redux/api/topicsApi"

const topicSchema = z.object({
  chapterId: z.string().min(1, "Chapter required"),
  title: z.string().min(2, "Topic title required"),
  slug: z.string().min(2, "Slug required"),
  order: z.coerce.number().min(0),
  status: z.nativeEnum(TopicStatus),
})

type TopicFormValues = z.input<typeof topicSchema>
type TopicFormOutput = z.output<typeof topicSchema>

interface Props {
  mode: "create" | "edit"
  topic?: ITopic
  onSuccess?: () => void
}

interface ChapterOption {
  _id: string
  title: string
}

export default function TopicForm({ mode, topic, onSuccess }: Props) {
  const { data: chapters } = useGetChaptersQuery()

  const [createTopic, { isLoading: createLoading }] = useCreateTopicMutation()

  const [updateTopic, { isLoading: updateLoading }] = useUpdateTopicMutation()
const {
  register,
  handleSubmit,
  reset,
  setValue,
  control,
  formState: { errors },
} = useForm<TopicFormValues, unknown, TopicFormOutput>({
  resolver: zodResolver(topicSchema),

  defaultValues: {
    chapterId: "",
    title: "",
    slug: "",
    order: 0,
    status: TopicStatus.DRAFT,
  },
})
  useEffect(() => {
    if (mode === "edit" && topic) {
      reset({
        chapterId: topic.chapterId,

        title: topic.title,

        slug: topic.slug,

        order: topic.order,

        status: topic.status,
      })
    }
  }, [mode, topic, reset])

  function generateSlug(value: string) {
    return value
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]+/g, "")
  }
async function onSubmit(values: TopicFormOutput) {
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
    console.log(error)
  }
}
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* Chapter */}

      <div>
        <label className="text-sm font-medium">Chapter</label>

        <Controller
          name="chapterId"

          control={control}

          render={({ field }) => (
            <Select
              value={field.value}

              onValueChange={field.onChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select chapter" />
              </SelectTrigger>

              <SelectContent>
                {chapters?.data?.map((chapter: ChapterOption) => (
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

        <p className="text-sm text-red-500">{errors.chapterId?.message}</p>
      </div>

      {/* Title */}

      <div>
        <label className="text-sm font-medium">Topic Title</label>

        <Input
          placeholder="Example: Linear Equation"

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
      </div>

      {/* Order */}

      <div>
        <label className="text-sm font-medium">Order</label>

        <Input
          type="number"

          {...register("order")}
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
                <SelectItem value={TopicStatus.DRAFT}>Draft</SelectItem>

                <SelectItem value={TopicStatus.APPROVED}>Approved</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
      </div>

      <Button
        disabled={createLoading || updateLoading}

        type="submit"

        className="w-full"
      >
        {createLoading || updateLoading
          ? "Saving..."
          : mode === "create"
            ? "Create Topic"
            : "Update Topic"}
      </Button>
    </form>
  )
}
