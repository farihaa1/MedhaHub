"use client"

import { useFormContext } from "react-hook-form"

import { Button } from "@/components/ui/button"

import AcademicSection from "./AcademicSection"
import QuestionSection from "./QuestionSection"
import QuestionOptions from "./QuestionOptions"
import QuestionMetadata from "./QuestionMetadata"

import { QuestionFormValues } from "./question.schema"

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
    <form
      onSubmit={methods.handleSubmit(onSubmit)}
      className=""
    >
      <AcademicSection />
      <QuestionSection />
      <QuestionOptions />
      <QuestionMetadata />

      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={isLoading}
        >
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
