
"use client"

import { useMemo, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"

import { topics } from "@/app/data/topicsData"

export default function ConfigureExamPage() {
  const router = useRouter()
 const searchParams = useSearchParams()

 const topicString = searchParams.get("topics") ?? ""

 const topicIds = useMemo(
   () => topicString.split(",").filter(Boolean),
   [topicString]
 )
const selectedTopics = useMemo(() => {
  return topics.filter((topic) => topicIds.includes(topic.id))
}, [topicIds])

  const totalAvailableQuestions = selectedTopics.reduce(
    (sum, topic) => sum + topic.totalQuestions,
    0
  )

  const [questionCount, setQuestionCount] = useState(20)
  const [timeLimit, setTimeLimit] = useState(20)

  const handleStart = () => {
    router.push(
      `/practice/exam?topics=${topicIds.join(",")}&count=${questionCount}`
    )
  }

  return (
    <main className="mx-auto max-w-5xl space-y-8 p-8">

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
              key={topic.id}
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
              className={`rounded-xl px-5 py-3 ${
                questionCount === count
                  ? "bg-emerald-500 text-white"
                  : "bg-zinc-800 text-zinc-300"
              }`}
            >
              {count}
            </button>
          ))}

        </div>

      </section>

      {/* Difficulty */}

      <section className="rounded-xl border border-white/10 bg-[#141C2D] p-6">

        <h2 className="mb-4 text-lg font-semibold text-white">
          Difficulty
        </h2>

      </section>

      {/* Summary */}

      <section className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-6">

        <div className="flex items-center justify-between">

          <div>

            <p className="text-zinc-400">
              Topics Selected
            </p>

            <h3 className="text-2xl font-bold text-white">
              {selectedTopics.length}
            </h3>

          </div>

          <div>

            <p className="text-zinc-400">
              Available Questions
            </p>

            <h3 className="text-2xl font-bold text-white">
              {totalAvailableQuestions}
            </h3>

          </div>

          <div>

            <p className="text-zinc-400">
              Exam Size
            </p>

            <h3 className="text-2xl font-bold text-white">
              {questionCount}
            </h3>

          </div>

        </div>

      </section>

      <button
        onClick={handleStart}
        className="w-full rounded-xl bg-emerald-500 py-4 text-lg font-semibold text-white hover:bg-emerald-600"
      >
        Start Practice Exam
      </button>

    </main>
  )
}