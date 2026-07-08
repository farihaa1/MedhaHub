import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
interface Option {
  id: string
  label: string
  text: string
}

interface Question {
  id: string
  question: string
  options: Option[]
  correctOptionId: string
}

export function calculateResult(
  questions: Question[],
  answers: Record<string, string>
) {
  let correct = 0
  let wrong = 0
  let skipped = 0

  questions.forEach((question) => {
    const selected = answers[question.id]

    if (!selected) {
      skipped++
      return
    }

    if (selected === question.correctOptionId) {
      correct++
    } else {
      wrong++
    }
  })

  const total = questions.length

  const score = correct

  const percentage = total === 0 ? 0 : Math.round((correct / total) * 100)

  return {
    total,
    correct,
    wrong,
    skipped,
    score,
    percentage,
  }
}

/**
 * Format a date into a readable string.
 */
export function formatDate(
  date: Date | string,
  locale = "en-US"
) {
  return new Intl.DateTimeFormat(locale, {
    dateStyle: "medium",
  }).format(new Date(date));
}

/**
 * Format date and time.
 */
export function formatDateTime(
  date: Date | string,
  locale = "en-US"
) {
  return new Intl.DateTimeFormat(locale, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(date));
}

/**
 * Sleep utility.
 */
export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}