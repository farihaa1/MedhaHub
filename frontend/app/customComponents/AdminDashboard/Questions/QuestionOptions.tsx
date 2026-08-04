"use client"

import { useFormContext } from "react-hook-form"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

import { QuestionFormValues } from "./question.schema"


export default function QuestionOptions() {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<QuestionFormValues>()

  // Always provide a fallback
  const options = watch("options") ?? []

  const selectedIndex = Math.max(
    0,
    options.findIndex((option) => option.isCorrect)
  )

  function handleCorrectAnswer(index: number) {
    const updated = options.map((option, i) => ({
      ...option,
      isCorrect: i === index,
    }))

    setValue("options", updated, {
      shouldDirty: true,
      shouldValidate: true,
    })
  }

  // Prevent rendering until options exist
  if (!options.length) {
    return (
      <div className="space-y-6 rounded-xl border bg-card p-6">
        <div>
          <h2 className="text-lg font-semibold">Options</h2>
          <p className="text-sm text-muted-foreground">Loading options...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 bg-card p-2 ">
      <RadioGroup
        value={selectedIndex.toString()}
        onValueChange={(value) => handleCorrectAnswer(Number(value))}
        className="grid grid-cols-2"
      >
        {options.map((option, index) => (
          <div
            key={index}
            className="flex items-start gap-4 p-4"
          >
            <RadioGroupItem
              value={index.toString()}
              id={`correct-${index}`}
              className="mt-3"
            />

            <div className="flex-1 space-y-3">
              <Input
                id={`option-${index}`}
                placeholder={`Option ${String.fromCharCode(65 + index)}`}
                {...register(`options.${index}.text`)}
              />

              {errors.options?.[index]?.text && (
                <p className="text-sm text-red-500">
                  {errors.options[index]?.text?.message}
                </p>
              )}

              <Input
                placeholder="Image URL (optional)"
                {...register(`options.${index}.image`)}
              />
            </div>
          </div>
        ))}
      </RadioGroup>

      {errors.options?.message && (
        <p className="text-sm text-red-500">
          {errors.options.message as string}
        </p>
      )}
    </div>
  )
}
