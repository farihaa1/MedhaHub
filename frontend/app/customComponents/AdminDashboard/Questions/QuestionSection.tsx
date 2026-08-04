"use client"

import { useFormContext } from "react-hook-form"
import { Textarea } from "@/components/ui/textarea"
import { QuestionFormValues } from "./question.schema"

export default function QuestionSection() {
  const {
    register,
    formState: { errors },
  } = useFormContext<QuestionFormValues>()

  return (
    <div className="space-y-2 bg-card p-6 py-2">

      <Textarea
        rows={6}
        placeholder="Write question..."
        {...register("questionText")}
      />

      {errors.questionText && (
        <p className="text-sm text-red-500">{errors.questionText.message}</p>
      )}
    </div>
  )
}
