"use client"

import { useMemo, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"

import {
  AlertCircle,
  CheckCircle2,
  FileQuestion,
  Hash,
  Layers,
  Play,
} from "lucide-react"

import { useGetTopicsQuery } from "@/app/redux/api/topicsApi"
import { useStartExamMutation } from "@/app/redux/api/examEngineApi"

import { useAppSelector } from "@/app/redux/hooks"

export default function ConfigureExamPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  // ========================================================
  // AUTH
  // ========================================================

  const { isLoading: userLoading } = useAppSelector((state) => state.auth)

  // ========================================================
  // TOPICS
  // ========================================================

  const {
    data: topicResponse,
    isLoading: topicsLoading,
    isError: topicsError,
  } = useGetTopicsQuery()

  const [startExam, { isLoading: startLoading }] = useStartExamMutation()

  const topics = useMemo(() => topicResponse?.data ?? [], [topicResponse?.data])

  // ========================================================
  // SELECTED TOPICS FROM URL
  // ========================================================

  const topicString = searchParams.get("topics") ?? ""

  const topicIds = useMemo(
    () =>
      topicString
        .split(",")
        .map((id) => id.trim())
        .filter(Boolean),
    [topicString]
  )

  const selectedTopics = useMemo(
    () => topics.filter((topic) => topicIds.includes(topic._id)),
    [topics, topicIds]
  )

  // ========================================================
  // QUESTION COUNT
  // ========================================================

  const MAX_QUESTIONS = 100

  const totalAvailableQuestions = useMemo(
    () =>
      selectedTopics.reduce(
        (sum, topic) => sum + (topic.totalQuestions ?? 0),
        0
      ),
    [selectedTopics]
  )

  const availableQuestions = Math.min(totalAvailableQuestions, MAX_QUESTIONS)

  const [questionCount, setQuestionCount] = useState(20)

  // ========================================================
  // QUESTION COUNT HANDLER
  // ========================================================

  const handleQuestionChange = (value: number) => {
    if (Number.isNaN(value)) {
      return
    }

    if (availableQuestions <= 0) {
      setQuestionCount(0)
      return
    }

    if (value < 1) {
      setQuestionCount(1)
      return
    }

    if (value > availableQuestions) {
      setQuestionCount(availableQuestions)
      return
    }

    setQuestionCount(value)
  }

  // ========================================================
  // START EXAM
  // ========================================================

  const handleStart = async () => {
    if (!selectedTopics.length) {
      console.error("No topics selected.")
      return
    }

    if (availableQuestions <= 0) {
      console.error("No questions available.")
      return
    }

    const finalQuestionCount = Math.min(
      questionCount,
      availableQuestions,
      MAX_QUESTIONS
    )

    if (finalQuestionCount <= 0) {
      console.error("Invalid question count.")
      return
    }

    try {
      const response = await startExam({
        // IMPORTANT:
        // Backend expects lowercase "topic"
        examType: "topic",

        topicIds,

        questionCount: finalQuestionCount,
      }).unwrap()

      console.log("Exam started:", response)

      const sessionId = response.data?._id

      if (!sessionId) {
        console.error("Exam started but no session ID was returned.")

        return
      }

      router.push(`/exam/${sessionId}`)
    } catch (error) {
      console.error("Failed to start exam:", error)
    }
  }

  // ========================================================
  // LOADING
  // ========================================================

  if (userLoading || topicsLoading) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />

          <h2 className="mt-5 text-base font-semibold">
            পরীক্ষা প্রস্তুত করা হচ্ছে
          </h2>

          <p className="mt-1 text-xs text-muted-foreground">
            আপনার নির্বাচিত টপিকের তথ্য লোড হচ্ছে...
          </p>
        </div>
      </main>
    )
  }

  // ========================================================
  // TOPIC ERROR
  // ========================================================

  if (topicsError) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center">
        <div className="max-w-md text-center">
          <AlertCircle className="mx-auto h-10 w-10 text-destructive" />

          <h2 className="mt-4 text-lg font-semibold">টপিক লোড করা যায়নি</h2>

          <p className="mt-2 text-sm text-muted-foreground">
            টপিকের তথ্য লোড করার সময় একটি সমস্যা হয়েছে। আবার চেষ্টা করুন।
          </p>
        </div>
      </main>
    )
  }

  // ========================================================
  // RENDER
  // ========================================================

  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-8">
      <div className="space-y-6">
        {/* ==================================================
            HEADER
        ================================================== */}

        <section>
          <div className="flex items-center gap-2 text-primary">
            <Layers className="h-4 w-4" />

            <span className="text-xs font-medium">Practice Exam</span>
          </div>

          <h1 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">
            পরীক্ষা প্রস্তুতি
          </h1>

          <p className="mt-2 text-sm text-muted-foreground">
            আপনার নির্বাচিত টপিক থেকে একটি অনুশীলনী পরীক্ষা তৈরি করুন।
          </p>
        </section>

        {/* ==================================================
            SELECTED TOPICS
        ================================================== */}

        <section className="rounded-2xl border bg-card p-5 shadow-sm sm:p-6">
          <div className="mb-5 flex items-center gap-2">
            <Layers className="h-5 w-5 text-primary" />

            <h2 className="text-base font-semibold">নির্বাচিত টপিক</h2>
          </div>

          {selectedTopics.length === 0 ? (
            <div className="flex items-center gap-2 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
              <AlertCircle className="h-4 w-4 shrink-0" />

              <span>কোনো টপিক নির্বাচন করা হয়নি।</span>
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {selectedTopics.map((topic) => (
                <div
                  key={topic._id}
                  className="flex items-center gap-2 rounded-full border bg-muted/50 px-3 py-1.5 text-xs"
                >
                  <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />

                  <span>{topic.title}</span>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* ==================================================
            QUESTION SELECTION
        ================================================== */}

        <section className="rounded-2xl border bg-card p-5 shadow-sm sm:p-6">
          <div className="mb-6 flex items-center gap-3">
            <FileQuestion className="h-5 w-5 text-primary" />

            <h2 className="text-base font-semibold">
              প্রশ্ন সংখ্যা নির্বাচন করুন
            </h2>
          </div>

          {/* QUICK OPTIONS */}

          <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
            {[10, 20, 30, 50].map((num) => {
              const disabled = num > availableQuestions

              const selected = questionCount === num

              return (
                <button
                  key={num}
                  type="button"
                  disabled={disabled}
                  onClick={() => setQuestionCount(num)}
                  className={`rounded-xl border py-3 text-sm font-medium transition ${
                    selected
                      ? "border-primary bg-primary text-primary-foreground"
                      : "hover:bg-muted"
                  } ${disabled ? "cursor-not-allowed opacity-40" : ""}`}
                >
                  {num} টি
                </button>
              )
            })}

            {/* ALL */}

            <button
              type="button"
              disabled={availableQuestions === 0}
              onClick={() => setQuestionCount(availableQuestions)}
              className={`rounded-xl border py-3 text-sm font-medium transition ${
                questionCount === availableQuestions && availableQuestions > 0
                  ? "border-primary bg-primary text-primary-foreground"
                  : "hover:bg-muted"
              } ${
                availableQuestions === 0 ? "cursor-not-allowed opacity-40" : ""
              }`}
            >
              সবগুলো
            </button>
          </div>

          {/* CUSTOM COUNT */}

          <div className="mt-5 flex items-center gap-3 rounded-xl border bg-muted/20 px-4 py-3">
            <Hash className="h-5 w-5 shrink-0 text-muted-foreground" />

            <input
              type="number"
              min={availableQuestions > 0 ? 1 : 0}
              max={availableQuestions}
              value={questionCount}
              disabled={availableQuestions === 0}
              onChange={(event) =>
                handleQuestionChange(Number(event.target.value))
              }
              className="w-full bg-transparent text-sm outline-none disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="নিজের সংখ্যা লিখুন"
            />

            <span className="text-xs whitespace-nowrap text-muted-foreground">
              / {availableQuestions}
            </span>
          </div>

          {/* INFO */}

          <div className="mt-4 space-y-1 text-xs leading-5 text-muted-foreground">
            <p>
              উপলব্ধ প্রশ্ন:{" "}
              <span className="font-semibold text-foreground">
                {totalAvailableQuestions}
              </span>{" "}
              টি।
            </p>

            <p>
              এই পরীক্ষায় সর্বোচ্চ{" "}
              <span className="font-semibold text-foreground">
                {MAX_QUESTIONS}
              </span>{" "}
              টি প্রশ্ন নেওয়া যাবে।
            </p>
          </div>
        </section>

        {/* ==================================================
            SUMMARY
        ================================================== */}

        <section className="rounded-2xl border bg-primary/5 p-5 sm:p-6">
          <div className="grid gap-5 sm:grid-cols-3">
            <div>
              <p className="text-xs text-muted-foreground">টপিক</p>

              <p className="mt-1 text-2xl font-bold">{selectedTopics.length}</p>
            </div>

            <div>
              <p className="text-xs text-muted-foreground">মোট প্রশ্ন</p>

              <p className="mt-1 text-2xl font-bold">
                {totalAvailableQuestions}
              </p>
            </div>

            <div>
              <p className="text-xs text-muted-foreground">পরীক্ষার প্রশ্ন</p>

              <p className="mt-1 text-2xl font-bold">{questionCount}</p>
            </div>
          </div>
        </section>

        {/* ==================================================
            NO QUESTIONS WARNING
        ================================================== */}

        {selectedTopics.length > 0 && availableQuestions === 0 && (
          <div className="flex items-start gap-3 rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />

            <div>
              <p className="font-semibold">এই টপিকে কোনো প্রশ্ন পাওয়া যায়নি।</p>

              <p className="mt-1 text-xs opacity-80">
                অন্য টপিক নির্বাচন করুন অথবা পরে আবার চেষ্টা করুন।
              </p>
            </div>
          </div>
        )}

        {/* ==================================================
            START
        ================================================== */}

        <button
          type="button"
          disabled={
            !selectedTopics.length || availableQuestions === 0 || startLoading
          }
          onClick={handleStart}
          className="flex w-full items-center justify-center gap-3 rounded-2xl bg-primary py-4 text-sm font-semibold text-primary-foreground shadow-sm transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Play className="h-4 w-4" />

          {startLoading ? "পরীক্ষা তৈরি হচ্ছে..." : "পরীক্ষা শুরু করুন"}
        </button>
      </div>
    </main>
  )
}
