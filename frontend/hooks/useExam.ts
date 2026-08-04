"use client"

import { useEffect, useMemo, useState } from "react"
import { Question } from "@/app/type"
import { ExamSession } from "@/lib/exam/type"
import { calculateResult } from "@/lib/utils"

interface UseExamProps {
  exam: ExamSession
  questions: Question[]
}

export function useExam({ exam, questions }: UseExamProps) {
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [submitted, setSubmitted] = useState(false)

  const [timeLeft, setTimeLeft] = useState(exam.totalQuestions * 60)

  useEffect(() => {
    if (submitted) return

    if (timeLeft <= 0) {
      submitExam()
      return
    }

    const interval = setInterval(() => {
      setTimeLeft((prev) => prev - 1)
    }, 1000)

    return () => clearInterval(interval)
  }, [submitted, timeLeft])

  const answeredCount = useMemo(() => Object.keys(answers).length, [answers])

  function handleAnswer(questionId: string, optionId: string) {
    if (submitted) return

    if (answers[questionId]) return

    setAnswers((prev) => ({
      ...prev,
      [questionId]: optionId,
    }))
  }

  const result = useMemo(() => {
    return calculateResult(questions, answers)
  }, [questions, answers])

  function submitExam() {
    setSubmitted(true)
  }

  return {
    answers,
    submitted,
    result,
    answeredCount,
    handleAnswer,
    submitExam,
    minutes: Math.floor(timeLeft / 60),
    seconds: timeLeft % 60,
  }
}
