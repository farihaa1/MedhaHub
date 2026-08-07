"use client"

import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export const subjectSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),

  slug: z.string().min(1, "Slug is required"),

  url: z.string().min(1, "URL is required"),
})

export type SubjectFormValues = z.infer<typeof subjectSchema>

interface SubjectFormProps {
  defaultValues?: Partial<SubjectFormValues>

  onSubmit: (values: SubjectFormValues) => void | Promise<void>

  loading?: boolean
}

const initialValues: SubjectFormValues = {
  title: "",
  slug: "current-affairs",
  url: "",
}

export default function SubjectForm({
  defaultValues,
  onSubmit,
  loading = false,
}: SubjectFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SubjectFormValues>({
    resolver: zodResolver(subjectSchema),

    defaultValues: {
      ...initialValues,
      ...defaultValues,
    },
  })

  useEffect(() => {
    reset({
      ...initialValues,
      ...defaultValues,
    })
  }, [defaultValues, reset])

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* =========================
          TITLE
      ========================= */}

      <div className="space-y-2">
        <label htmlFor="title" className="text-sm font-medium">
          Subject Title
        </label>

        <Input
          id="title"
          placeholder="Mathematics"
          disabled={loading}
          {...register("title")}
        />

        {errors.title && (
          <p className="text-sm text-destructive">{errors.title.message}</p>
        )}
      </div>

      {/* =========================
          SLUG
      ========================= */}

      <div className="space-y-2">
        <label htmlFor="slug" className="text-sm font-medium">
          Subject Slug
        </label>

        <Input
          id="slug"
          placeholder="mathematical-reasoning"
          disabled={loading}
          {...register("slug")}
        />

        {errors.slug && (
          <p className="text-sm text-destructive">{errors.slug.message}</p>
        )}

        <p className="text-xs text-muted-foreground">
          Example: current-affairs
        </p>
      </div>

      {/* =========================
          URL
      ========================= */}

      <div className="space-y-2">
        <label htmlFor="url" className="text-sm font-medium">
          URL
        </label>

        <Input
          id="url"
          placeholder="/subjects/mathematical-reasoning"
          disabled={loading}
          {...register("url")}
        />

        {errors.url && (
          <p className="text-sm text-destructive">{errors.url.message}</p>
        )}
      </div>

      {/* =========================
          SUBMIT
      ========================= */}

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Saving..." : "Save Subject"}
      </Button>
    </form>
  )
}
