"use client"

import { useParams } from "next/navigation"

import { useGetResultQuery } from "@/app/redux/api/examEngineApi"

export default function ResultPage() {
  const params = useParams()

  const sessionId = params.sessionId as string

  const { data, isLoading, isError } = useGetResultQuery(sessionId)

  if (isLoading) {
    return <main className="p-8 text-center">Loading result...</main>
  }

  if (isError || !data) {
    return (
      <main className="p-8 text-center text-red-500">
        Failed to load result
      </main>
    )
  }

  const result = data.data

  return (
    <main className="mx-auto max-w-3xl p-6">
      <div className="rounded-xl border p-8 shadow">
        <h1 className="mb-8 text-center text-3xl font-bold">Exam Result</h1>

        <div className="grid gap-4">
          <ResultItem title="Total Questions" value={result.totalQuestions} />

          <ResultItem title="Attempted" value={result.attempted} />

          <ResultItem title="Correct" value={result.correct} />

          <ResultItem title="Wrong" value={result.wrong} />

          <ResultItem title="Skipped" value={result.skipped} />

          <ResultItem title="Score" value={result.score} />

          <ResultItem title="Accuracy" value={`${result.accuracy}%`} />
        </div>
      </div>
    </main>
  )
}

function ResultItem({
  title,
  value,
}: {
  title: string
  value: string | number
}) {
  return (
    <div className="flex justify-between rounded-lg border p-4">
      <span>{title}</span>

      <span className="font-semibold">{value}</span>
    </div>
  )
}
