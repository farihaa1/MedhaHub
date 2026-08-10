"use client"

import { ArrowLeft, Home, RefreshCw, Trophy } from "lucide-react"

import { useParams, useRouter } from "next/navigation"
import ResultStats from "@/app/customComponents/Exam/ResultStats"
import { useGetResultQuery } from "@/app/redux/api/resultApi"
import ResultQuestionCard from "@/app/customComponents/Exam/ResultQuestionCard"

export default function ResultPage() {
  const params = useParams()
  const router = useRouter()

  const sessionId = params.sessionId as string

  const { data, isLoading, isError, refetch } = useGetResultQuery(sessionId, {
    skip: !sessionId,
  })

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <div className="w-full max-w-md text-center">
          <h2 className="text-base font-semibold">Preparing your results</h2>

          <p className="mt-2 text-xs leading-5 text-muted-foreground">
            Your answers are being evaluated. Almost there.
          </p>

          <div className="mx-auto mt-5 h-1.5 w-40 overflow-hidden rounded-full bg-muted">
            <div className="h-full w-1/2 animate-pulse rounded-full bg-primary" />
          </div>
        </div>
      </div>
    )
  }

  if (isError || !data?.data) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <div className="w-full max-w-md text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
            <RefreshCw className="h-5 w-5" />
          </div>

          <h1 className="mt-5 text-lg font-semibold">Unable to load results</h1>

          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Your exam may have been submitted, but the result could not be
            retrieved right now.
          </p>

          <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
            <button
              type="button"
              onClick={() => refetch()}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-xs font-medium text-primary-foreground transition hover:opacity-90"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              Try Again
            </button>

            <button
              type="button"
              onClick={() => router.replace("/dashboard")}
              className="inline-flex items-center justify-center gap-2 rounded-lg border px-4 py-2.5 text-xs font-medium transition hover:bg-muted"
            >
              <Home className="h-3.5 w-3.5" />
              Dashboard
            </button>
          </div>
        </div>
      </div>
    )
  }

  const result = data.data.result
  const questions = data.data.questions

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8">
      <header className="mb-8">
        <button
          type="button"
          onClick={() => router.replace("/dashboard")}
          className="mb-5 inline-flex items-center gap-2 text-xs font-medium text-muted-foreground transition hover:text-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Dashboard
        </button>

        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Trophy className="h-5 w-5" />
          </div>

          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Examination Result
            </h1>

            <p className="mt-1 text-sm text-muted-foreground">
              Here&apos;s how you performed in this examination.
            </p>
          </div>
        </div>
      </header>

      <ResultStats result={result} />

      <section className="mt-10">
        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-lg font-bold">Question Review</h2>

            <p className="mt-1 text-xs text-muted-foreground">
              Review your answers, correct answers and explanations.
            </p>
          </div>

          <div className="w-fit rounded-lg bg-muted px-3 py-1.5 text-xs font-medium">
            {questions.length} Questions
          </div>
        </div>

        <div className="space-y-4">
          {questions.map((question, index) => (
            <ResultQuestionCard
              key={question.id ?? `result-question-${index}`}
              question={question}
              index={index}
            />
          ))}
        </div>
      </section>

      <div className="mt-10 flex justify-center">
        <button
          type="button"
          onClick={() => router.replace("/dashboard")}
          className="inline-flex items-center gap-2 rounded-lg border px-5 py-2.5 text-sm font-medium transition hover:bg-muted"
        >
          <Home className="h-4 w-4" />
          Back to Dashboard
        </button>
      </div>
    </div>
  )
}
