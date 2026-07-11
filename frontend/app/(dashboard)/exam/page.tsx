"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"

import {
  useGetExamSessionQuery,
  useSubmitAnswerMutation,
  useSubmitExamMutation,
} from "@/app/redux/api/examEngineApi"

import ExamTimer from "@/app/customComponents/Exam-engine/ExamTimer"
import SubmitButton from "@/app/customComponents/Exam-engine/SubmitButton"
import QuestionNavigator from "@/app/customComponents/Exam-engine/QuestionNavigator"
import OptionList from "@/app/customComponents/Exam-engine/OptionList"
import QuestionCard from "@/app/customComponents/Exam-engine/QuestionCard"

export default function ExamPage() {
  const params = useParams()
  const router = useRouter()

  const sessionId = params.sessionId as string

  const { data, isLoading, isError } = useGetExamSessionQuery(sessionId)

  const [submitAnswer, { isLoading: answerLoading }] = useSubmitAnswerMutation()

  const [submitExam, { isLoading: submitLoading }] = useSubmitExamMutation()

  const [currentQuestion, setCurrentQuestion] = useState(0)

  const [selectedOption, setSelectedOption] = useState<string>("")

  if (isLoading) {
    return <main className="p-8 text-center text-white">Loading exam...</main>
  }

  if (isError || !data) {
    return (
      <main className="p-8 text-center text-red-400">
        Failed to load exam session
      </main>
    )
  }

  const session = data.data

  const question = session.questions[currentQuestion]

  const handleNext = async () => {
    if (selectedOption) {
      await submitAnswer({
        sessionId: session._id,
        questionId: question._id,
        selectedOptionId: selectedOption,
      }).unwrap()
    }

    if (currentQuestion < session.questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1)

      setSelectedOption("")
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1)

      setSelectedOption("")
    }
  }

  const handleQuestionChange = (index: number) => {
    setCurrentQuestion(index)

    setSelectedOption("")
  }

  const handleSubmit = async () => {
    try {
      await submitExam({
        sessionId: session._id,
      }).unwrap()

      router.push(`/exam/result/${session._id}`)
    } catch (error) {
      console.error("Submit failed", error)
    }
  }

  return (
    <main className="mx-auto max-w-7xl p-6">
      {/* Header */}

      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Practice Exam</h1>

        <ExamTimer endTime={session.expiresAt} />
      </div>

      <div className="grid grid-cols-4 gap-6">
        {/* Question Area */}

        <div className="col-span-3 rounded-xl bg-[#141C2D] p-6">
          <div className="mb-4 text-sm text-zinc-400">
            Question {currentQuestion + 1}
            {" / "}
            {session.questions.length}
          </div>

          <QuestionCard question={question} />

          <div className="mt-6">
            <OptionList
              options={question.options}

              selected={selectedOption}

              onSelect={setSelectedOption}
            />
          </div>

          <div className="mt-8 flex justify-between">
            <button
              onClick={handlePrevious}

              disabled={currentQuestion === 0}

              className="rounded-lg bg-zinc-700 px-6 py-3 text-white disabled:opacity-40"
            >
              Previous
            </button>

            <button
              onClick={handleNext}

              disabled={
                answerLoading ||
                currentQuestion === session.questions.length - 1
              }

              className="rounded-lg bg-emerald-500 px-6 py-3 text-white disabled:opacity-40"
            >
              {answerLoading ? "Saving..." : "Next"}
            </button>
          </div>
        </div>

        {/* Navigator */}

        <aside className="rounded-xl bg-[#141C2D] p-5">
          <h2 className="mb-4 font-semibold text-white">Questions</h2>

          <QuestionNavigator
            total={session.questions.length}

            current={currentQuestion}

            onChange={handleQuestionChange}
          />

          <div className="mt-8">
            <SubmitButton
              onSubmit={handleSubmit}

            //   disabled={submitLoading}
            />
          </div>
        </aside>
      </div>
    </main>
  )
}
