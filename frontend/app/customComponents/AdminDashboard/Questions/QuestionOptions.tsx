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

  const options = watch("options")
  const correctAnswer = watch("correctAnswer")

  return (
    <div className="space-y-6 rounded-xl border bg-card p-6">
      <div>
        <h2 className="text-lg font-semibold">Options</h2>

        <p className="text-sm text-muted-foreground">
          Add four options and choose the correct answer.
        </p>
      </div>

      <RadioGroup
        value={String(correctAnswer)}
        onValueChange={(value) =>
          setValue("correctAnswer", Number(value), {
            shouldValidate: true,
          })
        }
        className="space-y-4"
      >
        {options.map((_, index) => (
          <div
            key={index}
            className="flex items-start gap-4 rounded-lg border p-4"
          >
            <RadioGroupItem
              value={String(index)}
              id={`correct-${index}`}
              className="mt-3"
            />

            <div className="flex-1 space-y-2">
              <Label htmlFor={`option-${index}`}>
                Option {String.fromCharCode(65 + index)}
              </Label>

              <Input
                id={`option-${index}`}
                placeholder={`Enter option ${String.fromCharCode(65 + index)}`}
                {...register(`options.${index}.text`)}
              />

              {errors.options?.[index]?.text && (
                <p className="text-sm text-red-500">
                  {errors.options[index]?.text?.message}
                </p>
              )}
            </div>
          </div>
        ))}
      </RadioGroup>

      {errors.correctAnswer && (
        <p className="text-sm text-red-500">{errors.correctAnswer.message}</p>
      )}
    </div>
  )
}
