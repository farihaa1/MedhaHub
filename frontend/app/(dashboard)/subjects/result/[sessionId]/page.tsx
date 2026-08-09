
"use client"

import { useParams } from "next/navigation"
import { useGetResultQuery } from "@/app/redux/api/examEngineApi"

export default function ResultPage() {
  const params = useParams()

  const sessionId = params.sessionId as string

  const {
    data: resultResponse,
    isLoading,
    isError,
  } = useGetResultQuery(sessionId)

  // Loading
  if (isLoading) {
    return (
      <main className="min-h-screen p-6">
        <div className="mx-auto max-w-5xl">
          <div className="flex min-h-[50vh] items-center justify-center">
            <p className="text-muted-foreground">
              ফলাফল লোড হচ্ছে...
            </p>
          </div>
        </div>
      </main>
    )
  }

  // Error / no result
  if (isError || !resultResponse?.data?.result) {
    return (
      <main className="min-h-screen p-6">
        <div className="mx-auto max-w-5xl">
          <div className="flex min-h-[50vh] flex-col items-center justify-center text-center">
            <h1 className="text-2xl font-bold">
              ফলাফল পাওয়া যায়নি
            </h1>

            <p className="mt-3 text-sm text-muted-foreground">
              পরীক্ষার ফলাফল লোড করতে সমস্যা হয়েছে।
            </p>
          </div>
        </div>
      </main>
    )
  }

  // IMPORTANT:
  // API response structure:
  //
  // resultResponse.data = {
  //   result: ExamResult,
  //   questions: ResultQuestion[]
  // }
  //
  // Therefore we need:
  // resultResponse.data.result

  const result = resultResponse.data.result

  return (
    <main className="min-h-screen space-y-6 p-6">
      <div className="mx-auto max-w-5xl space-y-6">
        {/* Header */}
        <section>
          <h1 className="text-3xl font-bold tracking-tight">
            পরীক্ষার ফলাফল
          </h1>

          <p className="mt-2 text-muted-foreground">
            আপনার পরীক্ষার ফলাফল নিচে দেখানো হয়েছে।
          </p>
        </section>

        {/* Result Card */}
        <section className="rounded-2xl border bg-card p-6 shadow-sm">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {/* Total Questions */}
            <div className="rounded-xl border bg-muted/40 p-5">
              <p className="text-sm text-muted-foreground">
                মোট প্রশ্ন
              </p>

              <h2 className="mt-2 text-3xl font-bold">
                {result.totalQuestions ?? 0}
              </h2>
            </div>

            {/* Correct Answers */}
            <div className="rounded-xl border bg-muted/40 p-5">
              <p className="text-sm text-muted-foreground">
                সঠিক উত্তর
              </p>

              {/* <h2 className="mt-2 text-3xl font-bold text-green-600">
                {result.correctAnswers ?? 0}
              </h2> */}
            </div>

            {/* Wrong Answers */}
            <div className="rounded-xl border bg-muted/40 p-5">
              <p className="text-sm text-muted-foreground">
                ভুল উত্তর
              </p>

              {/* <h2 className="mt-2 text-3xl font-bold text-red-600">
                {result.wrongAnswers ?? 0}
              </h2> */}
            </div>

            {/* Score */}
            <div className="rounded-xl border bg-muted/40 p-5">
              <p className="text-sm text-muted-foreground">
                স্কোর
              </p>

              <h2 className="mt-2 text-3xl font-bold text-primary">
                {result.score ?? 0}
              </h2>
            </div>
          </div>
        </section>

        {/* Percentage */}
        <section className="rounded-2xl border bg-primary/5 p-6">
          <p className="text-sm text-muted-foreground">
            আপনার পারফরম্যান্স
          </p>

          <h2 className="mt-2 text-4xl font-bold">
            {/* {result.percentage ?? 0}% */}
          </h2>
        </section>

        {/* Session Information */}
        <section className="rounded-2xl border bg-card p-6 shadow-sm">
          <h2 className="text-xl font-semibold">
            পরীক্ষার তথ্য
          </h2>

          <div className="mt-5 space-y-3 text-sm">
            {/* Session ID */}
            <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
              <span className="text-muted-foreground">
                Session ID
              </span>

              <span className="break-all font-medium">
                {sessionId}
              </span>
            </div>

            {/* Created At */}
            {/* {result.createdAt && (
              <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                <span className="text-muted-foreground">
                  সম্পন্ন করার সময়
                </span>

                <span className="font-medium">
                  {new Date(result.createdAt).toLocaleString("bn-BD")}
                </span>
              </div>
            )} */}
          </div>
        </section>
      </div>
    </main>
  )
}
