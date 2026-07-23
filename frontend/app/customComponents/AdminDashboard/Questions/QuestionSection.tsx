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
    <div className="space-y-6 rounded-xl border bg-card p-6">
      <div>
        <h2 className="text-lg font-semibold">Question</h2>

        <p className="text-sm text-muted-foreground">Enter the question.</p>
      </div>

      <Textarea
        rows={6}
        placeholder="Write question..."
        {...register("question")}
      />

      {errors.question && (
        <p className="text-sm text-red-500">{errors.question.message}</p>
      )}
    </div>
  )
}
