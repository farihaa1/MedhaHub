"use client"

import Image from "next/image"
import { CheckCircle2, XCircle } from "lucide-react"

import type { ExamOptionLabel } from "@/app/redux/types/exam.type"

import type { ResultReviewQuestion } from "@/app/redux/types/result.type"

interface ResultQuestionCardProps {
  question: ResultReviewQuestion
  index: number
}

export default function ResultQuestionCard({
  question,
  index,
}: ResultQuestionCardProps) {
  const isAnswered = question.selectedOption !== undefined

  const isCorrect = question.isCorrect

  return (
    <article className="rounded-2xl border bg-card p-5 shadow-sm sm:p-6">
      {/* =====================================================
          QUESTION
      ===================================================== */}

      <div className="flex items-start gap-3">
        {/* NUMBER */}

        <div
          className={[
            "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold",
            isCorrect
              ? "bg-green-100 text-green-700"
              : isAnswered
                ? "bg-red-100 text-red-700"
                : "bg-muted text-muted-foreground",
          ].join(" ")}
        >
          {question.order || index + 1}
        </div>

        {/* QUESTION CONTENT */}

        <div className="min-w-0 flex-1">
          <h3 className="text-base leading-7 font-semibold sm:text-lg">
            {question.questionText}
          </h3>

          {/* QUESTION IMAGE */}

          {question.questionImage && (
            <div className="relative mt-4 h-64 w-full overflow-hidden rounded-xl border bg-background">
              <Image
                src={question.questionImage}
                alt={`Question ${question.order || index + 1}`}
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

      <div className="mt-5 grid gap-3">
        {question.options.map((option) => {
          const isSelected = question.selectedOption === option.label

          const isCorrectOption =
            question.correctOption === option.label || option.isCorrect

          let containerClass = "border-border hover:bg-muted/50"

          if (isCorrectOption) {
            containerClass = "border-green-500 bg-green-50 dark:bg-green-950/20"
          } else if (isSelected) {
            containerClass = "border-red-500 bg-red-50 dark:bg-red-950/20"
          }

          return (
            <div
              key={`${question.id}-${option.label}`}
              className={[
                "flex items-start gap-3 rounded-xl border p-4",
                containerClass,
              ].join(" ")}
            >
              {/* LETTER */}

              <span
                className={[
                  "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-sm font-bold",
                  isCorrectOption
                    ? "border-green-500 bg-green-500 text-white"
                    : isSelected
                      ? "border-red-500 bg-red-500 text-white"
                      : "bg-background",
                ].join(" ")}
              >
                {option.label}
              </span>

              {/* OPTION TEXT */}

              <div className="flex flex-1 items-start justify-between gap-3">
                <div className="flex-1">
                  <p className="text-sm leading-6">{option.text}</p>

                  {/* OPTION IMAGE */}

                  {option.image && (
                    <div className="relative mt-3 h-40 w-full overflow-hidden rounded-lg border">
                      <Image
                        src={option.image}
                        alt={`Option ${option.label}`}
                        fill
                        sizes="(max-width: 768px) 100vw, 500px"
                        className="object-contain"
                      />
                    </div>
                  )}
                </div>

                {isCorrectOption && (
                  <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-green-600" />
                )}

                {isSelected && !isCorrectOption && (
                  <XCircle className="mt-1 h-5 w-5 shrink-0 text-red-600" />
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* =====================================================
          STATUS
      ===================================================== */}

      <div className="mt-5">
        {isCorrect && (
          <div className="flex items-center gap-2 text-sm font-medium text-green-600">
            <CheckCircle2 className="h-4 w-4" />
            Correct Answer
          </div>
        )}

        {isAnswered && !isCorrect && (
          <div className="flex items-center gap-2 text-sm font-medium text-red-600">
            <XCircle className="h-4 w-4" />
            Incorrect Answer
          </div>
        )}

        {!isAnswered && (
          <div className="text-sm font-medium text-muted-foreground">
            Not Answered
          </div>
        )}
      </div>

      {/* =====================================================
          EXPLANATION
      ===================================================== */}

      {question.explanation && (
        <div className="mt-5 rounded-xl bg-muted/50 p-4">
          <p className="text-sm font-semibold">Explanation</p>

          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            {question.explanation}
          </p>
        </div>
      )}

      {/* EXPLANATION IMAGE */}

      {question.explanationImage && (
        <div className="relative mt-4 h-56 w-full overflow-hidden rounded-xl border">
          <Image
            src={question.explanationImage}
            alt="Explanation"
            fill
            sizes="(max-width: 768px) 100vw, 768px"
            className="object-contain"
          />
        </div>
      )}
    </article>
  )
}
