"use client"

import { useMemo, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"

import {
  CheckCircle2,
  FileQuestion,
  Layers,
  Play,
  AlertCircle,
  Hash,
} from "lucide-react"

import { useGetTopicsQuery } from "@/app/redux/api/topicsApi"
import { useStartExamMutation } from "@/app/redux/api/examEngineApi"
import useCurrentUser from "@/app/(public)/(auth)/hooks/useCurrentUser"

export default function ConfigureExamPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const { user, isLoading: userLoading } = useCurrentUser()

  const { data: topicResponse, isLoading: topicsLoading } = useGetTopicsQuery()

  const [startExam, { isLoading: startLoading }] = useStartExamMutation()

  const topics = topicResponse?.data ?? []

  const topicString = searchParams.get("topics") ?? ""

  const topicIds = useMemo(
    () => topicString.split(",").filter(Boolean),

    [topicString]
  )

  const selectedTopics = useMemo(
    () => topics.filter((topic) => topicIds.includes(topic._id)),

    [topics, topicIds]
  )

  const totalAvailableQuestions = useMemo(
    () =>
      selectedTopics.reduce(
        (sum, topic) => sum + (topic.totalQuestions ?? 0),
        0
      ),

    [selectedTopics]
  )

  const MAX_QUESTIONS = 100

  const availableQuestions = Math.min(totalAvailableQuestions, MAX_QUESTIONS)

  const [questionCount, setQuestionCount] = useState(20)

  const handleQuestionChange = (value: number) => {
    if (value < 1) return

    if (value > MAX_QUESTIONS) {
      setQuestionCount(MAX_QUESTIONS)
      return
    }

    setQuestionCount(value)
  }
 
  const handleStart = async () => {
   console.log(questionCount)
    if (!selectedTopics.length) return

    try {
      const response = await startExam({
        examType: "topic",

        topicIds,

        count: Math.min(questionCount, MAX_QUESTIONS),

        userId: user?._id,
      }).unwrap()

      router.push(`/exam/${response.data._id}`)
    } catch (error) {
      console.error("পরীক্ষা শুরু করতে সমস্যা:", error)
    }
  }

  if (userLoading || topicsLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <div className="space-y-4 text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />

          <p className="text-muted-foreground">তথ্য লোড হচ্ছে...</p>
        </div>
      </main>
    )
  }

  return (
    <main className="container mx-auto max-w-5xl space-y-8 px-4 py-10">
      {/* Header */}

      <section>
        <h1 className="text-3xl font-bold tracking-tight">পরীক্ষা প্রস্তুতি</h1>

        <p className="mt-2 text-muted-foreground">
          আপনার নির্বাচিত টপিক থেকে অনুশীলনী পরীক্ষা তৈরি করুন।
        </p>
      </section>

      {/* Topics */}

      <section className="p-6">
        <div className="pb-2 flex items-center gap-2">
          <Layers className="h-5 w-5 text-primary" />

          <h2 className="text-xl font-semibold">নির্বাচিত টপিক</h2>
        </div>

        {selectedTopics.length === 0 ? (
          <div className="flex items-center gap-2 text-muted-foreground">
            <AlertCircle className="h-5 w-5" />
            কোনো টপিক নির্বাচন করা হয়নি।
          </div>
        ) : (
          <div className="flex flex-wrap gap-3">
            {selectedTopics.map((topic) => (
              <div
                key={topic._id}
                className="flex items-center gap-2 rounded-full border bg-muted px-4 py-2 text-sm"
              >
                <CheckCircle2 className="h-4 w-4 text-green-500" />

                {topic.title}
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Question Selection */}

      <section className="rounded-2xl border bg-card p-6 shadow-sm">
        <div className="mb-6 flex items-center gap-3">
          <FileQuestion className="h-5 w-5 text-primary" />

          <h2 className="text-xl font-semibold">প্রশ্ন সংখ্যা নির্বাচন করুন</h2>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
          {[10, 20, 30, 50].map((num) => (
            <button
              key={num}
              disabled={num > availableQuestions}
              onClick={() => setQuestionCount(num)}
              className={`rounded-xl border py-3 font-medium transition ${
                questionCount === num
                  ? "border-primary bg-primary text-primary-foreground"
                  : "hover:bg-muted"
              } ${
                num > availableQuestions ? "cursor-not-allowed opacity-40" : ""
              } `}
            >
              {num} টি
            </button>
          ))}

          <button
            onClick={() => setQuestionCount(availableQuestions)}

            className={`rounded-xl border py-3 font-medium ${
              questionCount === availableQuestions
                ? "border-primary bg-primary text-primary-foreground"
                : "hover:bg-muted"
            } `}
          >
            সবগুলো
          </button>
        </div>

        {/* Custom input */}

        <div className="mt-6 flex items-center gap-3 rounded-xl border p-3">
          <Hash className="h-5 w-5 text-muted-foreground" />

          <input
            type="number"
            min={1}
            max={100}
            value={questionCount}
            onChange={(e) => handleQuestionChange(Number(e.target.value))}
            className="w-full bg-transparent outline-none"
            placeholder="নিজের সংখ্যা লিখুন"
          />

          <p className="text-sm text-muted-foreground">/100</p>
        </div>

        <p className="mt-4 text-sm text-muted-foreground">
          উপলব্ধ প্রশ্ন:
          <b className="text-foreground"> {totalAvailableQuestions} </b>
          টি
          <br />
          সর্বোচ্চ ১০০ টি প্রশ্ন নেওয়া যাবে।
        </p>
      </section>

      {/* Summary */}

      <section className="rounded-2xl border bg-primary/5 p-6">
        <div className="grid gap-6 sm:grid-cols-3">
          <div>
            <p className="text-sm text-muted-foreground">টপিক</p>

            <h3 className="text-3xl font-bold">{selectedTopics.length}</h3>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">মোট প্রশ্ন</p>

            <h3 className="text-3xl font-bold">{totalAvailableQuestions}</h3>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">পরীক্ষার প্রশ্ন</p>

            <h3 className="text-3xl font-bold">{questionCount}</h3>
          </div>
        </div>
      </section>

      {/* Start */}

      <button
        disabled={!selectedTopics.length || startLoading}

        onClick={handleStart}

        className="flex w-full items-center justify-center gap-3 rounded-2xl bg-primary py-4 text-lg font-semibold text-primary-foreground transition hover:opacity-90 disabled:opacity-50"
      >
        <Play className="h-5 w-5" />

        {startLoading ? "পরীক্ষা তৈরি হচ্ছে..." : "পরীক্ষা শুরু করুন"}
      </button>
    </main>
  )
}
