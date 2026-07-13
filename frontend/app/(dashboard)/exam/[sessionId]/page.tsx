"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"

import {
  useGetExamSessionQuery,
  useSubmitAnswerMutation,
  useSubmitExamMutation,
} from "@/app/redux/api/examEngineApi"

export default function ExamPage() {
  const params = useParams()
  const router = useRouter()

  const sessionId = params.sessionId as string

  const { data, isLoading, isError } = useGetExamSessionQuery(sessionId)

  const [answers, setAnswers] = useState<Record<string, string>>({})

  const [submitAnswer, { isLoading: answerLoading }] = useSubmitAnswerMutation()

  const [submitExam, { isLoading: submitLoading }] = useSubmitExamMutation()

  const handleSelectOption = (questionId: string, optionLabel: string) => {
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
      // Save every answered question
      for (const [questionId, selectedOption] of Object.entries(answers)) {
        const res = await submitAnswer({
          sessionId: session.id,
          questionId,
          selectedOption,
        }).unwrap()
       console.log(res)
      }
      // Submit exam
      await submitExam({
        sessionId: session.id,
      }).unwrap()

      router.push(`/exam/result/${session.id}`)
    } catch (err) {
      console.error("Submission failed:", err)
    }
  }

  return (
    <main className="mx-auto max-w-5xl p-6">
      {/* Header */}
      <div className="mb-8 rounded-lg border p-6 shadow">
        <h1 className="text-3xl font-bold">Exam</h1>

        <p className="mt-2 text-gray-600">
          Answered {answeredCount} / {totalQuestions}
        </p>
      </div>

      {/* Questions */}
      <div className="space-y-8">
        {session.questions.map((item, index) => (
          <div key={item.question.id} className="rounded-lg border p-6 shadow">
            <h2 className="mb-4 text-xl font-semibold">Question {index + 1}</h2>

            <p className="mb-6 text-lg">{item.question.questionText}</p>

            <div className="space-y-3">
              {item.question.options.map((option) => (
                <label
                  key={option.label}
                  className={`flex cursor-pointer items-center gap-3 rounded-lg border p-4 transition ${
                    answers[item.question.id] === option.label
                      ? "border-blue-500"
                      : "hover:bg-gray-200"
                  }`}
                >
                  <input
                    type="radio"
                    className="hidden"
                    name={item.question.id}
                    value={option.label}
                    checked={answers[item.question.id] === option.label}
                    onChange={() =>
                      handleSelectOption(item.question.id, option.label)
                    }
                  />

                  <div className="flex h-8 w-8 items-center justify-center rounded-full border font-semibold">
                    {option.label}
                  </div>

                  <span>{option.text}</span>
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Submit */}
      <div className="mt-10 flex justify-end">
        <button
          onClick={handleSubmit}
          disabled={submitLoading || answerLoading}
          className="rounded-lg bg-blue-600 px-8 py-3 text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {submitLoading || answerLoading ? "Submitting..." : "Submit Exam"}
        </button>
      </div>
    </main>
  )
}
