"use client"

import { useParams } from "next/navigation"

import { useGetResultQuery } from "@/app/redux/api/examEngineApi"
import ResultStats from "@/app/customComponents/Exam/ResultStats"
import QuestionCard from "@/app/customComponents/Exam/QuestionCard"

export default function ResultPage() {
  const params = useParams()

  const sessionId = params.sessionId as string

  const { data, isLoading, isError } = useGetResultQuery(sessionId)

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />

          <p className="mt-4 text-muted-foreground">Loading Result...</p>
        </div>
      </main>
    )
  }

  if (isError || !data) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <div className="rounded-xl border bg-white p-10 text-center shadow">
          <h2 className="text-2xl font-bold text-red-600">
            Failed to load result
          </h2>

          <p className="mt-2 text-muted-foreground">Please try again later.</p>
        </div>
      </main>
    )
  }

  const result = data?.data?.result

  const questions = data?.data?.questions

  return (
    <main className="min-h-screen bg-slate-50 py-10">
      <div className="mx-auto max-w-6xl space-y-8 px-4">
        {/* Statistics */}

        <ResultStats result={result} />

        {/* Questions */}

        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Question Review</h2>

            <div className="rounded-lg bg-white px-4 py-2 shadow">
              {questions.length} Questions
            </div>
          </div>

          {questions.map((question) => (
            <QuestionCard key={question.id} question={question} />
          ))}
        </section>
      </div>
    </main>
  )
}
