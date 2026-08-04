"use client"

import Link from "next/link"
import { notFound } from "next/navigation"
import { useParams } from "next/navigation"

import { Button } from "@/components/ui/button"

import { useGetQuestionBankQuery } from "@/app/redux/api/questionBankApi"

export default function QuestionBankDetailsPage() {
  const params = useParams()

  const id = params.id as string

  const { data, isLoading } = useGetQuestionBankQuery(id)

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (!data?.data) {
    notFound()
  }

  const bank = data.data

  return (
    <div className="space-y-6 p-16">
      {/* Header */}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{bank.title}</h1>

          <p className="text-muted-foreground">
            {bank.category}

            {bank.year && ` • ${bank.year}`}
          </p>
        </div>

        <Button asChild>
          <Link href={`/question-bank/${id}/edit`}>Edit</Link>
        </Button>
      </div>

      {/* Navigation */}

      <div className="flex gap-3">
        <Button asChild variant="outline">
          <Link href={`/question-bank/${id}/questions`}>Questions</Link>
        </Button>

        <Button asChild variant="outline">
          <Link href={`/question-bank/${id}/analytics`}>Analytics</Link>
        </Button>

        <Button asChild variant="outline">
          <Link href={`/question-bank/${id}/settings`}>Settings</Link>
        </Button>
      </div>

      {/* Details Card */}

      <div className="space-y-4 rounded-lg border p-6">
        <div>
          <strong>Total Questions:</strong> {bank.totalQuestions}
        </div>

        <div>
          <strong>Paper:</strong> {bank.paper}
        </div>

        <div>
          <strong>Organization:</strong> {bank.organization || "-"}
        </div>

        <div>
          <strong>Visibility:</strong> {bank.visibility}
        </div>

        <div>
          <strong>Published:</strong> {bank.isPublished ? "Yes" : "No"}
        </div>

        <div>
          <strong>Premium:</strong> {bank.isPremium ? "Yes" : "No"}
        </div>

        <div>
          <strong>Description:</strong>

          <p className="mt-2 text-muted-foreground">
            {bank.description || "No description"}
          </p>
        </div>
      </div>
    </div>
  )
}
