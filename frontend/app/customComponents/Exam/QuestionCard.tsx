"use client"

import { CheckCircle2, Loader2 } from "lucide-react"

import Image from "next/image"

import {
  ExamOptionLabel,
  ExamSessionQuestion,
} from "@/app/redux/types/exam.type"

interface QuestionCardProps {
  question: ExamSessionQuestion

  index: number

  selectedOption?: ExamOptionLabel

  onAnswer: (questionId: string, option: ExamOptionLabel) => void

  disabled?: boolean

  answerLoading?: boolean
}

export default function QuestionCard({
  question,
  index,
  selectedOption,
  onAnswer,
  disabled = false,
  answerLoading = false,
}: QuestionCardProps) {
  const optionLabels: ExamOptionLabel[] = ["A", "B", "C", "D"]

  return (
    <section className=" p-4 pt-8">
      {/* =====================================================
          QUESTION
      ===================================================== */}

      <div className="flex items-start gap-2">
        {/* QUESTION NUMBER */}

        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
          {index + 1}
        </div>

        {/* QUESTION CONTENT */}

        <div className="min-w-0 flex-1">
          <h2 className="text-base leading-7 font-semibold sm:text-lg">
            {question.questionText}
          </h2>

          {/* =================================================
              QUESTION IMAGE
          ================================================= */}

          {question.image && (
            <div className="relative mt-4 min-h-48 w-full overflow-hidden rounded-xl border bg-muted sm:min-h-64">
              <Image
                src={question.image}
                alt={`Question ${index + 1}`}
                fill
                sizes="(max-width: 768px) 100vw, 768px"
                className="object-contain"
              />
            </div>
          )}
        </div>
      </div>

      {/* =====================================================
          OPTIONS
      ===================================================== */}

      <div className="mt-5 grid grid-cols-2 gap-3">
        {question.options.map((optionData, optionIndex) => {
          const option = optionLabels[optionIndex]

          // Safety check in case backend
          // returns more than 4 options.
          if (!option) {
            return null
          }

          const selected = selectedOption === option

          return (
            <button
              key={optionData._id ?? `${question._id}-${option}`}
              type="button"
              disabled={disabled}
              onClick={() => onAnswer(question._id, option)}
              className={[
                "flex w-full items-start gap-3 rounded-xl border p-4 text-left transition",

                selected
                  ? "border-primary bg-primary/10 ring-1 ring-primary"
                  : "border-border hover:border-primary/50 hover:bg-muted/50",

                disabled ? "cursor-not-allowed opacity-70" : "cursor-pointer",
              ].join(" ")}
            >
              {/* =================================================
                    OPTION LETTER
                ================================================= */}

              <span
                className={[
                  "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-sm font-bold",

                  selected
                    ? "border-primary bg-primary text-primary-foreground"
                    : "bg-background",
                ].join(" ")}
              >
                {option}
              </span>

              {/* =================================================
                    OPTION CONTENT
                ================================================= */}

              <span className="flex flex-1 flex-col pt-1">
                <span className="text-sm leading-6">{optionData.text}</span>

                {/* =================================================
                      OPTION IMAGE
                  ================================================= */}

                {optionData.image && (
                  <span className="relative mt-3 block h-32 w-full overflow-hidden rounded-lg border bg-muted">
                    <Image
                      src={optionData.image}
                      alt={`Option ${option}`}
                      fill
                      sizes="(max-width: 768px) 100vw, 500px"
                      className="object-contain"
                    />
                  </span>
                )}
              </span>

             
            </button>
          )
        })}
      </div>
    </section>
  )
}
