
"use client"

import Link from "next/link"
import { notFound, useParams } from "next/navigation"

import { Button } from "@/components/ui/button"
import { useGetSingleQuestionBankQuery } from "@/app/redux/api/questionBanksApi"

export default function QuestionBankDetailsPage() {
  const params = useParams()

  const id = params.id as string

  const { data, isLoading, isError } =
    useGetSingleQuestionBankQuery(id)

  if (isLoading) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center">
        <p className="text-muted-foreground">
          Loading...
        </p>
      </main>
    )
  }

  if (isError || !data?.data) {
    notFound()
  }

  const bank = data.data

  return (
    <main className="mx-auto w-full max-w-6xl space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {bank.title}
          </h1>

          <p className="mt-1 text-muted-foreground">
            {bank.category}

            {bank.year && ` • ${bank.year}`}
          </p>
        </div>

        <Button asChild>
          <Link href={`/question-bank/${id}/edit`}>
            Edit
          </Link>
        </Button>
      </div>

      {/* Navigation */}
      <div className="flex flex-wrap gap-3">
        <Button asChild variant="outline">
          <Link href={`/question-bank/${id}/questions`}>
            Questions
          </Link>
        </Button>

        <Button asChild variant="outline">
          <Link href={`/question-bank/${id}/analytics`}>
            Analytics
          </Link>
        </Button>

        <Button asChild variant="outline">
          <Link href={`/question-bank/${id}/settings`}>
            Settings
          </Link>
        </Button>
      </div>

      {/* Details Card */}
      <div className="space-y-5 rounded-2xl border bg-card p-6 shadow-sm">
        <div>
          <strong>Total Questions:</strong>{" "}
          {bank.totalQuestions}
        </div>

        <div>
          <strong>Paper:</strong>{" "}
          {bank.paper || "-"}
        </div>

        <div>
          <strong>Organization:</strong>{" "}
          {bank.organization || "-"}
        </div>

        <div>
          <strong>Visibility:</strong>{" "}
          {bank.visibility}
        </div>

        <div>
          <strong>Published:</strong>{" "}
          {bank.isPublished ? "Yes" : "No"}
        </div>

        <div>
          <strong>Premium:</strong>{" "}
          {bank.isPremium ? "Yes" : "No"}
        </div>

        <div>
          <strong>Description:</strong>

          <p className="mt-2 text-muted-foreground">
            {bank.description || "No description"}
          </p>
        </div>
      </div>
    </main>
  )
}
