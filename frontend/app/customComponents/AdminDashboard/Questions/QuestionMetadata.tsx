"use client"

import { useFormContext } from "react-hook-form"

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

import { QuestionFormValues } from "./question.schema"

export default function QuestionMetadata() {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<QuestionFormValues>()

  return (
    <div className="space-y-6 rounded-xl border bg-card p-6">
      <div>
        <h2 className="text-lg font-semibold">Question Metadata</h2>

        <p className="text-sm text-muted-foreground">
          Configure difficulty, type, source, marks and tags.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Difficulty */}

        <div className="space-y-2">
          <Label>Difficulty</Label>

          <Select
            value={watch("difficulty")}
            onValueChange={(value) =>
              setValue(
                "difficulty",
                value as QuestionFormValues["difficulty"],
                {
                  shouldValidate: true,
                }
              )
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select difficulty" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="easy">Easy</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="hard">Hard</SelectItem>
            </SelectContent>
          </Select>

          {errors.difficulty && (
            <p className="text-sm text-red-500">{errors.difficulty.message}</p>
          )}
        </div>

        {/* Type */}

        <div className="space-y-2">
          <Label>Question Type</Label>

          <Select
            value={watch("type")}
            onValueChange={(value) =>
              setValue("type", value as QuestionFormValues["type"], {
                shouldValidate: true,
              })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Question Type" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="mcq">MCQ</SelectItem>
              <SelectItem value="written">Written</SelectItem>
              <SelectItem value="true_false">True / False</SelectItem>
            </SelectContent>
          </Select>

          {errors.type && (
            <p className="text-sm text-red-500">{errors.type.message}</p>
          )}
        </div>

        {/* Source */}

        <div className="space-y-2">
          <Label>Source</Label>

          <Input
            placeholder="BCS / Bank / Medical / Custom"
            {...register("source")}
          />

          {errors.source && (
            <p className="text-sm text-red-500">{errors.source.message}</p>
          )}
        </div>

        {/* Marks */}

        <div className="space-y-2">
          <Label>Marks</Label>

          <Input
            type="number"
            {...register("marks", {
              valueAsNumber: true,
            })}
          />

          {errors.marks && (
            <p className="text-sm text-red-500">{errors.marks.message}</p>
          )}
        </div>

        {/* Negative Marks */}

        <div className="space-y-2">
          <Label>Negative Marks</Label>

          <Input
            type="number"
            {...register("negativeMarks", {
              valueAsNumber: true,
            })}
          />

          {errors.negativeMarks && (
            <p className="text-sm text-red-500">
              {errors.negativeMarks.message}
            </p>
          )}
        </div>
      </div>

      {/* Explanation */}

      <div className="space-y-2">
        <Label>Explanation</Label>

        <Textarea
          rows={4}
          placeholder="Optional explanation..."
          {...register("explanation")}
        />

        {errors.explanation && (
          <p className="text-sm text-red-500">{errors.explanation.message}</p>
        )}
      </div>

      {/* Tags */}

      <div className="space-y-2">
        <Label>Tags</Label>

        <Input
          placeholder="math, algebra, bcs"
          onChange={(e) =>
            setValue(
              "tags",
              e.target.value
                .split(",")
                .map((tag) => tag.trim())
                .filter(Boolean),
              {
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
    </div>
  )
}
