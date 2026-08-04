"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"

import {
  useGetExamSessionQuery,
  useSubmitAnswerMutation,
  useSubmitExamMutation,
} from "@/app/redux/api/examEngineApi"
import Image from "next/image"
import { constants } from "node:buffer"

export default function ExamPage() {
  const params = useParams()
  const router = useRouter()

  const sessionId = params.sessionId as string

  const { data, isLoading, isError } = useGetExamSessionQuery(sessionId)

  const [answers, setAnswers] = useState<Record<string, string>>({})

  const [submitAnswer, { isLoading: answerLoading }] = useSubmitAnswerMutation()

  const [submitExam, { isLoading: submitLoading }] = useSubmitExamMutation()

  const handleSelectOption = (
    questionId: string,
    optionLabel: "A" | "B" | "C" | "D"
  ) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: optionLabel,
    }))
  }

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        Loading exam...
      </main>
    )
  }

  if (isError || !data) {
    return (
      <main className="flex min-h-screen items-center justify-center text-red-500">
        Failed to load exam session.
      </main>
    )
  }

  const session = data.data

  const answeredCount = Object.keys(answers).length
  const totalQuestions = session.questions.length

  const handleSubmit = async () => {
    try {
      for (const [questionId, selectedOption] of Object.entries(answers)) {
        await submitAnswer({
          sessionId: session.id,
          questionId,
          selectedOption: selectedOption as "A" | "B" | "C" | "D",
        }).unwrap()
      }

      const res = await submitExam({
        sessionId: session.id,
      }).unwrap()
      console.log(res)

      router.push(`/exam/result/${session.id}`)
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <main className="mx-auto max-w-5xl p-6">
      {/* Header */}

      <div className="sticky top-0 z-50 mb-8 rounded-2xl border bg-white/90 p-6 shadow-lg backdrop-blur">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Practice Exam</h1>

            <p className="mt-2 text-muted-foreground">
              {answeredCount} of {totalQuestions} Answered
            </p>
          </div>

          <div className="rounded-xl bg-blue-600 px-6 py-3 text-center text-white">
            <p className="text-sm">Questions</p>

            <p className="text-2xl font-bold">
              {answeredCount}/{totalQuestions}
            </p>
          </div>
        </div>
      </div>

      {/* Questions */}

      <div className="space-y-8">
        {session.questions.map((item, index) => (
          <div
            key={item.question.id}
            className="rounded-2xl border bg-white p-6 shadow-sm"
          >
            <h2 className="mb-2 text-xl font-bold">Question {index + 1}</h2>

            <p className="mb-6 text-lg">{item.question.questionText}</p>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {item.question.options.map((option, optionIndex) => {
                const optionLabel = String.fromCharCode(65 + optionIndex) as
                  "A" | "B" | "C" | "D"

                const selected = answers[item.question.id] === optionLabel

                return (
                  <label
                    key={option._id}
                    className={`flex cursor-pointer items-center gap-4 rounded-xl border-2 p-4 transition-all ${
                      selected
                        ? "border-blue-600 bg-blue-50"
                        : "border-gray-200 hover:border-blue-300 hover:bg-gray-50"
                    }`}
                  >
                    <input
                      type="radio"
                      className="hidden"
                      name={item.question.id}
                      value={optionLabel}
                      checked={selected}
                      onChange={() =>
                        handleSelectOption(item.question.id, optionLabel)
                      }
                    />

                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 font-bold ${
                        selected
                          ? "border-blue-600 bg-blue-600 text-white"
                          : "border-gray-300 bg-white"
                      }`}
                    >
                      {optionLabel}
                    </div>

                    <div className="flex-1">
                      <p>{option.text}</p>

                      {option.image && (
                        <Image
                          src={option.image}
                          alt={optionLabel}
                          className="mt-3 max-h-40 rounded-lg"
                        />
                      )}
                    </div>
                  </label>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Submit */}

      <div className="mt-10 flex justify-end">
        <button
          onClick={handleSubmit}
          disabled={submitLoading || answerLoading}
          className="rounded-xl bg-blue-600 px-8 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {submitLoading || answerLoading ? "Submitting..." : "Submit Exam"}
        </button>
      </div>
    </main>
  )
}
