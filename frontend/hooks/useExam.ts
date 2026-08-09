
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

import { IQuestion } from "@/app/redux/api/questionsApi"

// ==========================================================
// CLASSNAME UTILITY
// ==========================================================

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// ==========================================================
// EXAM RESULT
// ==========================================================

export interface ExamResult {
  total: number
  correct: number
  wrong: number
  skipped: number
  score: number
  percentage: number
}

// ==========================================================
// CALCULATE EXAM RESULT
// ==========================================================

export function calculateResult(
  questions: IQuestion[],
  answers: Record<string, string>
): ExamResult {
  let correct = 0
  let wrong = 0
  let skipped = 0

  questions.forEach((question) => {
    // The key is the question's MongoDB _id
    const selectedOptionId = answers[question._id]

    // No answer selected
    if (!selectedOptionId) {
      skipped++
      return
    }

    // Find the selected option
    const selectedOption = question.options.find(
      (option) => option._id === selectedOptionId
    )

    // Check whether the selected option is correct
    if (selectedOption?.isCorrect === true) {
      correct++
    } else {
      wrong++
    }
  })

  const total = questions.length

  const score = correct

  const percentage =
    total === 0
      ? 0
      : Math.round((correct / total) * 100)

  return {
    total,
    correct,
    wrong,
    skipped,
    score,
    percentage,
  }
}

// ==========================================================
// DATE FORMAT
// ==========================================================

export function formatDate(
  date: Date | string,
  locale = "en-US"
) {
  return new Intl.DateTimeFormat(locale, {
    dateStyle: "medium",
  }).format(new Date(date))
}

// ==========================================================
// DATE + TIME FORMAT
// ==========================================================

export function formatDateTime(
  date: Date | string,
  locale = "en-US"
) {
  return new Intl.DateTimeFormat(locale, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(date))
}

// ==========================================================
// SLEEP
// ==========================================================

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

 