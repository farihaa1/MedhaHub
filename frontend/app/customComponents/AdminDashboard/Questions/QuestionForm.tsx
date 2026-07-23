"use client"

import { useFormContext } from "react-hook-form"
import { Button } from "@/components/ui/button"
import AcademicSection from "./AcademicSection"
import QuestionOptions from "./QuestionOptions"
import QuestionMetadata from "./QuestionMetadata"

import { QuestionFormValues } from "./question.schema"
import QuestionSection from "./QuestionSection"

interface QuestionFormProps {
  mode?: "create" | "edit"
  isLoading: boolean
  onSubmit: (values: QuestionFormValues) => Promise<void>
}

export default function QuestionForm({
  mode = "create",
  isLoading,
  onSubmit,
}: QuestionFormProps) {
  const methods = useFormContext<QuestionFormValues>()

  return (
    <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-8">
      {/* Academic Information */}
      <AcademicSection />

      {/* Question */}
      <QuestionSection />

      {/* Options */}ext
      <QuestionOptions />

      {/* Metadata */}
      <QuestionMetadata />

      {/* Submit */}
      <div className="flex justify-end">
        <Button type="submit" disabled={isLoading}>
          {isLoading
            ? mode === "edit"
              ? "Updating..."
              : "Creating..."
            : mode === "edit"
              ? "Update Question"
              : "Create Question"}
        </Button>
      </div>
    </form>
  )
}
