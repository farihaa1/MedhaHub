"use client"

import { Controller, useFieldArray, useFormContext } from "react-hook-form"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import {
  QUESTION_SOURCE_OPTIONS,
  QuestionDifficulty,
  QuestionSourceType,
} from "@/app/redux/api/questionsApi"

import { QuestionFormValues } from "./question.schema"

export default function QuestionMetadata() {
  const {
    control,
    register,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<QuestionFormValues>()

  const tags = watch("tags") ?? []

  const { fields, append, remove } = useFieldArray({
    control,
    name: "sources",
  })

  return (
    <div className="space-y-6 bg-card p-6">
      <div>
        <h2 className="text-lg font-semibold">Question Metadata</h2>

        <p className="text-[10px] text-muted-foreground">
          Configure question settings.
        </p>
      </div>

      {/* Difficulty + Type */}

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label>Difficulty</Label>

          <Controller
            control={control}
            name="difficulty"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Difficulty" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value={QuestionDifficulty.EASY}>Easy</SelectItem>

                  <SelectItem value={QuestionDifficulty.MEDIUM}>
                    Medium
                  </SelectItem>

                  <SelectItem value={QuestionDifficulty.HARD}>Hard</SelectItem>
                </SelectContent>
              </Select>
            )}
          />

          {errors.difficulty && (
            <p className="text-sm text-red-500">{errors.difficulty.message}</p>
          )}
        </div>
      </div>

      {/* Explanation */}

      <div className="space-y-2">
        <Label>Explanation</Label>

        <Textarea rows={5} {...register("explanation")} />

        {errors.explanation && (
          <p className="text-sm text-red-500">{errors.explanation.message}</p>
        )}
      </div>

      {/* Tags */}

      <div className="space-y-2">
        <Label>Tags</Label>

        <Input
          value={tags.join(", ")}
          placeholder="math, algebra, bcs"
          onChange={(e) =>
            setValue(
              "tags",
              e.target.value
                .split(",")
                .map((tag) => tag.trim())
                .filter(Boolean),
              {
                shouldDirty: true,
                shouldValidate: true,
              }
            )
          }
        />

        <p className="text-xs text-muted-foreground">
          Separate tags using commas.
        </p>

        {errors.tags && (
          <p className="text-sm text-red-500">
            {errors.tags.message as string}
          </p>
        )}
      </div>

      {/* Sources */}

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label>Sources</Label>

          <Button
            type="button"
            onClick={() =>
              append({
                type: QuestionSourceType.BCS,
                name: "",
                year: new Date().getFullYear(),
              })
            }
          >
            Add Source
          </Button>
        </div>

        {fields.map((field, index) => (
          <div key={field.id} className="space-y-4 rounded-lg border p-4">
            <div className="grid gap-4 md:grid-cols-3">
              <Controller
                control={control}
                name={`sources.${index}.type`}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>

                    <SelectContent>
                      {QUESTION_SOURCE_OPTIONS.map((source) => (
                        <SelectItem key={source.value} value={source.value}>
                          {source.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />

              <Input
                placeholder="Exam Name"
                {...register(`sources.${index}.name`)}
              />

              <Input
                type="number"
                placeholder="Year"
                {...register(`sources.${index}.year`, {
                  valueAsNumber: true,
                })}
              />
            </div>

            {errors.sources?.[index]?.name && (
              <p className="text-sm text-red-500">
                {errors.sources[index]?.name?.message}
              </p>
            )}

            <Button
              type="button"
              variant="destructive"
              onClick={() => remove(index)}
            >
              Remove Source
            </Button>
          </div>
        ))}
      </div>
    </div>
  )
}
