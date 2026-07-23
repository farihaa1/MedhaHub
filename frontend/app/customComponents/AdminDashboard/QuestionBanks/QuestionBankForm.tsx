"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import { z } from "zod"

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

import { Checkbox } from "@/components/ui/checkbox"

const categories = [
  "BCS",
  "PRIMARY",
  "NTRCA",
  "BANK",
  "UNIVERSITY",
  "CUSTOM",
] as const

const papers = ["PRELIMINARY", "WRITTEN", "VIVA"] as const

const visibilities = ["PUBLIC", "PRIVATE"] as const

export const questionBankSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),

  category: z.enum(categories),

  year: z.number().optional(),

  paper: z.enum(papers).optional(),

  organization: z.string().optional(),

  description: z.string().optional(),

  visibility: z.enum(visibilities),

  isPublished: z.boolean(),

  isPremium: z.boolean(),
})

type QuestionBankFormValues = z.infer<typeof questionBankSchema>

interface Props {
  defaultValues?: Partial<QuestionBankFormValues>

  onSubmit: (values: QuestionBankFormValues) => void

  loading?: boolean
}

export default function QuestionBankForm({
  defaultValues,
  onSubmit,
  loading = false,
}: Props) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<QuestionBankFormValues>({
    resolver: zodResolver(questionBankSchema),

    defaultValues: {
      title: "",

      category: "BCS",

      year: undefined,

      paper: "PRELIMINARY",

      organization: "",

      description: "",

      visibility: "PUBLIC",

      isPublished: true,

      isPremium: false,

      ...defaultValues,
    },
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* TITLE */}

      <div>
        <label className="text-sm font-medium">Title</label>

        <Input placeholder="BCS 49th Preliminary" {...register("title")} />

        {errors.title && (
          <p className="text-sm text-red-500">{errors.title.message}</p>
        )}
      </div>

      {/* CATEGORY */}

      <div>
        <label className="text-sm font-medium">Category</label>

        <Controller
          name="category"
          control={control}

          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>

              <SelectContent>
                {categories.map((item) => (
                  <SelectItem key={item} value={item}>
                    {item}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
      </div>

      {/* YEAR */}

      <div>
        <label className="text-sm font-medium">Year</label>

        <Input
          type="number"

          {...register("year", {
            valueAsNumber: true,
          })}
        />
      </div>

      {/* PAPER */}

      <div>
        <label className="text-sm font-medium">Paper</label>

        <Controller
          name="paper"
          control={control}

          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>

              <SelectContent>
                {papers.map((item) => (
                  <SelectItem key={item} value={item}>
                    {item}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
      </div>

      {/* ORGANIZATION */}

      <div>
        <label className="text-sm font-medium">Organization</label>

        <Input
          placeholder="BPSC"

          {...register("organization")}
        />
      </div>

      {/* DESCRIPTION */}

      <div>
        <label className="text-sm font-medium">Description</label>

        <Textarea {...register("description")} />
      </div>

      {/* VISIBILITY */}

      <div>
        <label className="text-sm font-medium">Visibility</label>

        <Controller
          name="visibility"

          control={control}

          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>

              <SelectContent>
                {visibilities.map((item) => (
                  <SelectItem key={item} value={item}>
                    {item}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
      </div>

      {/* PUBLISHED */}

      <div className="flex items-center gap-3">
        <Controller
          name="isPublished"

          control={control}

          render={({ field }) => (
            <Checkbox
              checked={field.value}

              onCheckedChange={field.onChange}
            />
          )}
        />

        <label>Published</label>
      </div>

      {/* PREMIUM */}

      <div className="flex items-center gap-3">
        <Controller
          name="isPremium"

          control={control}

          render={({ field }) => (
            <Checkbox
              checked={field.value}

              onCheckedChange={field.onChange}
            />
          )}
        />

        <label>Premium</label>
      </div>

      <Button disabled={loading} type="submit">
        {loading ? "Saving..." : "Save Question Bank"}
      </Button>
    </form>
  )
}
