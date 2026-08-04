"use client"

import { useState } from "react"
import {
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Circle,
  XCircle,
  MinusCircle,
} from "lucide-react"

interface Option {
  label: "A" | "B" | "C" | "D"
  text: string
  isCorrect: boolean
}

interface ReviewQuestion {
  id: string

  order: number

  questionText: string

  options: Option[]

  selectedOption?: "A" | "B" | "C" | "D"

  correctOption: "A" | "B" | "C" | "D"

  isCorrect: boolean

  explanation?: string
}

interface Props {
  question: ReviewQuestion
}

export default function QuestionCard({ question }: Props) {
  const [showExplanation, setShowExplanation] = useState(false)

  const skipped = !question.selectedOption

  return (
    <article className="overflow-hidden rounded-2xl border bg-white shadow-sm transition hover:shadow-md">
      {/* Header */}

      <div className="flex items-start justify-between border-b bg-gray-50 px-6 py-5">
        <div>
          <p className="text-sm font-medium text-gray-500">
            Question {question.order}
          </p>

          <h2 className="mt-2 text-lg leading-7 font-semibold">
            {question.questionText}
          </h2>
        </div>

        {skipped ? (
          <span className="flex items-center gap-1 rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-700">
            <MinusCircle size={16} />
            Skipped
          </span>
        ) : question.isCorrect ? (
          <span className="flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
            <CheckCircle2 size={16} />
            Correct
          </span>
        ) : (
          <span className="flex items-center gap-1 rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">
            <XCircle size={16} />
            Wrong
          </span>
        )}
      </div>

      {/* Options */}

      <div className="p-4 grid grid-cols-2 gap-3 items-center">
        {question.options.map((option) => {
          const selected = option.label === question.selectedOption

          const correct = option.label === question.correctOption

          return (
            <div
              key={option.label}
              className={`rounded-sm border p-3 px-5 transition-all ${
                correct
                  ? "border-green-500 bg-green-50"
                  : selected
                    ? "border-red-500 bg-red-50"
                    : "border-gray-200"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div
                    className={`flex h-9 w-9 items-center justify-center rounded-full border font-semibold ${
                      correct
                        ? "border-green-600 bg-green-600 text-white"
                        : selected
                          ? "border-red-600 bg-red-600 text-white"
                          : ""
                    }`}
                  >
                    {option.label}
                  </div>

                  <span className="text-[15px]">{option.text}</span>
                </div>

                <div className="flex gap-2">
                  {selected && (
                    <span className="rounded bg-blue-600 px-2 py-1 text-xs font-medium text-white">
                      Your Answer
                    </span>
                  )}

                  {correct && (
                    <span className="rounded bg-green-600 px-2 py-1 text-xs font-medium text-white">
                      Correct
                    </span>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Footer */}

      <div className="border-t px-6 py-4">
        <button
          onClick={() => setShowExplanation(!showExplanation)}
          className="flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700"
        >
          {showExplanation ? (
            <>
              Hide Explanation
              <ChevronUp size={18} />
            </>
          ) : (
            <>
              Show Explanation
              <ChevronDown size={18} />
            </>
          )}
        </button>

        {showExplanation && (
          <div className="mt-5 rounded-xl border-l-4 border-blue-500 bg-blue-50 p-5">
            <h3 className="mb-2 font-semibold text-blue-800">Explanation</h3>

            <p className="text-sm leading-7 whitespace-pre-line text-gray-700">
              {question.explanation || "No explanation available."}
            </p>
          </div>
        )}
      </div>
    </article>
  )
}
