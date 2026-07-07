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
