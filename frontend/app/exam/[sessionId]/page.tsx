"use client"

import { useCallback, useMemo, useState } from "react"
import { useParams, useRouter } from "next/navigation"

import { CheckCircle2, Loader2, Send } from "lucide-react"

import {
  useGetExamSessionQuery,
  useSubmitAnswerMutation,
  useSubmitExamMutation,
} from "@/app/redux/api/examEngineApi"

import QuestionCard from "@/app/customComponents/Exam/QuestionCard"
import ExamTimer from "@/app/customComponents/Exam/ExamTimer"

import { ExamOption } from "@/app/redux/api/examSessionApi"
import { ExamSessionQuestion } from "@/app/redux/types/exam.type"

export default function ExamPage() {
  const params = useParams()
  const router = useRouter()

  const sessionId = params.sessionId as string

  // ============================================================
  // GET EXAM SESSION
  // ============================================================

  const { data, isLoading, isError, refetch } = useGetExamSessionQuery(
    sessionId,
    {
      skip: !sessionId,
    }
  )

  // ============================================================
  // SUBMIT ANSWER MUTATION
  // ============================================================

  const [submitAnswer, { isLoading: answerLoading }] = useSubmitAnswerMutation()

  // ============================================================
  // SUBMIT EXAM MUTATION
  // ============================================================

  const [submitExam, { isLoading: examSubmitting }] = useSubmitExamMutation()

  // ============================================================
  // ANSWERS
  // ============================================================

  const [answers, setAnswers] = useState<Record<string, ExamOption>>({})

  // ============================================================
  // EXPIRED
  // ============================================================

  const [expired, setExpired] = useState(false)

  // ============================================================
  // SESSION
  // ============================================================

  const session = data?.data

  console.log("EXAM SESSION:", session)

  const questions: ExamSessionQuestion[] = session?.questions ?? []

  // ============================================================
  // ANSWER COUNT
  // ============================================================

  const answeredCount = useMemo(() => {
    return Object.keys(answers).length
  }, [answers])

  const unansweredCount = questions.length - answeredCount

  // ============================================================
  // SUBMIT EXAM
  // ============================================================

  const submitExamAndRedirect = useCallback(
    async (autoSubmit = false) => {
      // Prevent duplicate submission
      if (examSubmitting) {
        return
      }

      try {
        // --------------------------------------------------------
        // If timer expired, show expired message
        // --------------------------------------------------------

        if (autoSubmit) {
          setExpired(true)
        }

        console.log("Submitting exam:", sessionId)

        // --------------------------------------------------------
        // IMPORTANT
        // Wait for backend submission.
        //
        // If this succeeds, backend should:
        // 1. Submit ExamSession
        // 2. Create Result
        // --------------------------------------------------------

        const response = await submitExam(sessionId).unwrap()

        console.log("Exam submitted successfully:", response)

        // --------------------------------------------------------
        // ONLY redirect after successful submission
        // --------------------------------------------------------

        router.push(`/exam/result/${sessionId}`)
      } catch (error) {
        console.error("Failed to submit exam:", error)

        // --------------------------------------------------------
        // IMPORTANT:
        // Do NOT redirect if submission failed.
        //
        // Otherwise result page will request:
        //
        // GET /result/:sessionId
        //
        // before ResultService.createResult()
        // has created the result.
        // --------------------------------------------------------

        if (autoSubmit) {
          console.error("Automatic exam submission failed.")
        }
      }
    },
    [examSubmitting, sessionId, submitExam, router]
  )

  // ============================================================
  // TIMER EXPIRED
  //
  // ExamTimer is NOT changed.
  // ============================================================

  const handleExpire = useCallback(() => {
    if (expired || examSubmitting) {
      return
    }

    setExpired(true)

    void submitExamAndRedirect(true)
  }, [expired, examSubmitting, submitExamAndRedirect])

  // ============================================================
  // HANDLE ANSWER
  // ============================================================

  const handleAnswer = async (questionId: string, option: ExamOption) => {
    // ----------------------------------------------------------
    // Don't allow answers after expiration
    // ----------------------------------------------------------

    if (expired || examSubmitting) {
      return
    }

    // ----------------------------------------------------------
    // Optimistic UI update
    // ----------------------------------------------------------

    setAnswers((previous) => ({
      ...previous,
      [questionId]: option,
    }))

    try {
      // --------------------------------------------------------
      // Save answer on server
      // --------------------------------------------------------

      const response = await submitAnswer({
        sessionId,
        questionId,
        selectedOption: option,
      }).unwrap()

      console.log("Answer saved:", response)
    } catch (error) {
      console.error("Failed to save answer:", error)

      // --------------------------------------------------------
      // Remove optimistic answer if API failed
      // --------------------------------------------------------

      setAnswers((previous) => {
        const updated = {
          ...previous,
        }

        delete updated[questionId]

        return updated
      })
    }
  }

  // ============================================================
  // MANUAL SUBMIT
  // ============================================================

  const handleSubmit = async () => {
    if (expired || examSubmitting) {
      return
    }

    const confirmed = window.confirm(
      unansweredCount > 0
        ? `আপনি ${unansweredCount}টি প্রশ্নের উত্তর দেননি। আপনি কি পরীক্ষা জমা দিতে চান?`
        : "আপনি কি পরীক্ষা জমা দিতে চান?"
    )

    if (!confirmed) {
      return
    }

    await submitExamAndRedirect(false)
  }

  // ============================================================
  // LOADING
  // ============================================================

  if (isLoading) {
    return (
      <main className="min-h-screen bg-background">
        <div className="mx-auto flex min-h-screen max-w-3xl items-center justify-center px-4">
          <div className="text-center">
            <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />

            <h2 className="mt-4 text-lg font-semibold">পরীক্ষা লোড হচ্ছে...</h2>

            <p className="mt-1 text-sm text-muted-foreground">
              প্রশ্নগুলো প্রস্তুত করা হচ্ছে।
            </p>
          </div>
        </div>
      </main>
    )
  }

  // ============================================================
  // ERROR
  // ============================================================

  if (isError || !session) {
    return (
      <main className="min-h-screen bg-background">
        <div className="mx-auto flex min-h-screen max-w-3xl items-center justify-center px-4">
          <div className="w-full rounded-2xl border bg-card p-6 text-center shadow-sm">
            <h2 className="text-lg font-semibold">পরীক্ষা লোড করা যায়নি</h2>

            <p className="mt-2 text-sm text-muted-foreground">
              পরীক্ষার তথ্য পাওয়া যায়নি অথবা সেশনটি শেষ হয়ে গেছে।
            </p>

            <button
              type="button"
              onClick={() => refetch()}
              className="mt-6 rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition hover:opacity-90"
            >
              আবার চেষ্টা করুন
            </button>
          </div>
        </div>
      </main>
    )
  }

  // ============================================================
  // MAIN UI
  // ============================================================

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
        {/* ======================================================
            HEADER
        ====================================================== */}

        <header className="mb-6 rounded-2xl border bg-card p-4 shadow-sm sm:p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            {/* EXAM INFO */}

            <div>
              <h1 className="text-lg font-bold">পরীক্ষা</h1>

              <p className="mt-1 text-sm text-muted-foreground">
                মোট {questions.length}টি প্রশ্ন
              </p>
            </div>

            {/* EXAM STATUS */}

            <div className="flex flex-wrap items-center gap-3">
              {/* ANSWER COUNT */}

              <div className="flex items-center gap-2 rounded-xl bg-muted px-3 py-2 text-sm">
                <CheckCircle2 className="h-4 w-4 text-green-500" />

                <span>
                  {answeredCount}/{questions.length}
                </span>
              </div>

              {/* ==================================================
                  TIMER

                  DO NOT CHANGE ExamTimer
              ================================================== */}

              {session.startTime && session.duration !== undefined && (
                <ExamTimer
                  startTime={session.startTime}
                  duration={session.duration}
                  onExpire={handleExpire}
                />
              )}
            </div>
          </div>
        </header>

        {/* ======================================================
            EXPIRED MESSAGE
        ====================================================== */}

        {expired && (
          <div className="mb-6 rounded-2xl border border-destructive bg-destructive/10 p-4 text-center">
            <p className="font-semibold text-destructive">
              পরীক্ষার সময় শেষ হয়েছে।
            </p>

            <p className="mt-1 text-sm text-muted-foreground">
              আপনার পরীক্ষা স্বয়ংক্রিয়ভাবে জমা দেওয়া হচ্ছে...
            </p>

            <Loader2 className="mx-auto mt-3 h-5 w-5 animate-spin text-destructive" />
          </div>
        )}

        {/* ======================================================
            QUESTIONS
        ====================================================== */}

        <div className="mx-auto max-w-3xl space-y-5">
          {questions.map((question, index) => (
            <QuestionCard
              key={question._id}
              question={question}
              index={index}
              selectedOption={answers[question._id]}
              onAnswer={handleAnswer}
              disabled={expired || examSubmitting}
              answerLoading={answerLoading}
            />
          ))}
        </div>

        {/* ======================================================
            SUBMIT
        ====================================================== */}

        <section className="mt-6 rounded-2xl border bg-card p-5 shadow-sm sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            {/* SUBMIT INFO */}

            <div>
              <h2 className="font-semibold">পরীক্ষা শেষ?</h2>

              <p className="mt-1 text-sm text-muted-foreground">
                পরীক্ষা জমা দিলে আর উত্তর পরিবর্তন করা যাবে না।
              </p>
            </div>

            {/* SUBMIT BUTTON */}

            <button
              type="button"
              disabled={expired || examSubmitting}
              onClick={handleSubmit}
              className="flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {examSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  জমা হচ্ছে...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  পরীক্ষা জমা দিন
                </>
              )}
            </button>
          </div>
        </section>
      </div>
    </main>
  )
}
