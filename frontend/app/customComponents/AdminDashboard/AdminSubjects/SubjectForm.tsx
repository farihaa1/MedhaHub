"use client"

import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import { SubjectSlug } from "@/app/(dashboard)/subjects/subjects.type"

const subjectSlugs = [
  "current-affairs",
  "bangla-grammar",
  "english-language",
  "general-science",
  "international-affairs",
  "ethics-values",
  "mental-ability",
  "registration-school",
  "bangla-literature",
  "english-literature",
  "mathematical-reasoning",
  "bangladesh-affairs",
  "geography-disaster",
  "ict",
  "registration-college",
] as const satisfies readonly SubjectSlug[]

const subjectSchema = z.object({
  title: z.string().min(2, "Title is required"),
  slug: z.enum(subjectSlugs),
  url: z.string().min(1, "URL is required"),
})

export type SubjectFormValues = z.infer<typeof subjectSchema>

interface SubjectFormProps {
  defaultValues?: Partial<SubjectFormValues>
  onSubmit: (values: SubjectFormValues) => void | Promise<void>
  loading?: boolean
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
      title: "",
      slug: "current-affairs",
      url: "",
      ...defaultValues,
    },
  })

  useEffect(() => {
    reset({
      title: "",
      slug: "current-affairs",
      url: "",
      ...defaultValues,
    })
  }, [defaultValues, reset])

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* Title */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Subject Title</label>

        <Input placeholder="Mathematics" {...register("title")} />

        {errors.title && (
          <p className="text-sm text-destructive">{errors.title.message}</p>
        )}
      </div>

      {/* Slug */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Subject Slug</label>

        <select
          {...register("slug")}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
        >
          {subjectSlugs.map((slug) => (
            <option key={slug} value={slug}>
              {slug}
            </option>
          ))}
        </select>

        {errors.slug && (
          <p className="text-sm text-destructive">{errors.slug.message}</p>
        )}
      </div>

      {/* URL */}
      <div className="space-y-2">
        <label className="text-sm font-medium">URL</label>

        <Input
          placeholder="/subjects/mathematical-reasoning"
          {...register("url")}
        />

        {errors.url && (
          <p className="text-sm text-destructive">{errors.url.message}</p>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Saving..." : "Save Subject"}
      </Button>
    </form>
  )
}
