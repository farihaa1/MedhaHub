"use client"

import { useMemo, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"

import { useGetTopicsQuery } from "@/app/redux/api/topicsApi"
import { useStartExamMutation } from "@/app/redux/api/examEngineApi"
import { useCurrentUser } from "@/app/(public)/(auth)/hooks/useCurrentUser"

export default function ConfigureExamPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const { user, isLoading: userLoading } = useCurrentUser()

  console.log("Current User:", user)

  const { data: topicResponse, isLoading: topicsLoading } = useGetTopicsQuery()

  const [startExam, { isLoading: startLoading }] = useStartExamMutation()

  const topics = topicResponse?.data ?? []

  const topicString = searchParams.get("topics") ?? ""

  const topicIds = useMemo(
    () => topicString.split(",").filter(Boolean),

    [topicString]
  )

  const selectedTopics = useMemo(() => {
    return topics.filter((topic) => topicIds.includes(topic._id))
  }, [topics, topicIds])

  const totalAvailableQuestions = useMemo(() => {
    return selectedTopics.reduce((sum, topic) => sum + topic.totalQuestions, 0)
  }, [selectedTopics])

  const [questionCount, setQuestionCount] = useState(20)

  const handleStart = async () => {
    if (!selectedTopics.length) return

    try {
      const response = await startExam({
        examType: "topic",
        topicIds: topicIds,
        count: questionCount,
        user
      }).unwrap()

      console.log("Created Exam Session:", response)

      const sessionId = response.data._id

      router.push(`/exam/${sessionId}`)
    } catch (error) {
      console.error("Failed to start exam:", error)
    }
  }

  if (userLoading || topicsLoading) {
    return <main className="p-8 text-center text-white">Loading...</main>
  }

  return (
    <main className="mx-auto max-w-5xl space-y-8 p-8">
      {/* Header */}

      <div>
        <h1 className="text-3xl font-bold text-white">
          Configure Practice Exam
        </h1>

        <p className="mt-2 text-zinc-400">
          Choose how you want to generate your practice exam.
        </p>
      </div>

      {/* Selected Topics */}

      <section className="rounded-xl border border-white/10 bg-[#141C2D] p-6">
        <h2 className="mb-4 text-lg font-semibold text-white">
          Selected Topics
        </h2>

        <div className="flex flex-wrap gap-3">
          {selectedTopics.map((topic) => (
            <span
              key={topic._id}

              className="rounded-full bg-emerald-500/10 px-4 py-2 text-sm text-emerald-400"
            >
              {topic.title}
            </span>
          ))}
        </div>
      </section>

      {/* Question Count */}

      <section className="rounded-xl border border-white/10 bg-[#141C2D] p-6">
        <h2 className="mb-4 text-lg font-semibold text-white">
          Number of Questions
        </h2>

        <div className="flex gap-3">
          {[10, 20, 30, 50].map((count) => (
            <button
              key={count}

              onClick={() => setQuestionCount(count)}

              className={`rounded-xl px-5 py-3 transition ${
                questionCount === count
                  ? "bg-emerald-500 text-white"
                  : "bg-zinc-800 text-zinc-300"
              } `}
            >
              {count}
            </button>
          ))}
        </div>
      </section>

      {/* Summary */}

      <section className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-6">
        <div className="flex justify-between">
          <div>
            <p className="text-zinc-400">Topics Selected</p>

            <h3 className="text-2xl font-bold text-white">
              {selectedTopics.length}
            </h3>
          </div>

          <div>
            <p className="text-zinc-400">Available Questions</p>

            <h3 className="text-2xl font-bold text-white">
              {totalAvailableQuestions}
            </h3>
          </div>

          <div>
            <p className="text-zinc-400">Exam Size</p>

            <h3 className="text-2xl font-bold text-white">{questionCount}</h3>
          </div>
        </div>
      </section>

      {/* Start Button */}

      <button
        onClick={handleStart}

        disabled={!selectedTopics.length || startLoading}

        className="w-full rounded-xl bg-emerald-500 py-4 text-lg font-semibold text-white transition hover:bg-emerald-600 disabled:bg-zinc-600"
      >
        {startLoading ? "Creating Exam..." : "Start Practice Exam"}
      </button>
    </main>
  )
}
