"use client"

import { Loader2, Send } from "lucide-react"

interface SubmitBarProps {
  answeredCount: number
  totalQuestions: number
  submitLoading: boolean
  answerLoading: boolean
  onSubmit: () => void
}

export default function SubmitBar({
  answeredCount,
  totalQuestions,
  submitLoading,
  answerLoading,
  onSubmit,
}: SubmitBarProps) {
  const remaining = totalQuestions - answeredCount

  return (
    <div className="sticky bottom-0 z-50 mt-10 border-t bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-5 md:flex-row">
        {/* Left */}

        <div className="flex flex-wrap items-center gap-4">
          <div className="rounded-xl bg-blue-50 px-5 py-3">
            <p className="text-xs text-slate-500">Answered</p>

            <h2 className="text-2xl font-bold text-blue-600">
              {answeredCount}
            </h2>
          </div>

          <div className="rounded-xl bg-orange-50 px-5 py-3">
            <p className="text-xs text-slate-500">Remaining</p>

            <h2 className="text-2xl font-bold text-orange-600">{remaining}</h2>
          </div>
        </div>

        {/* Right */}

        <button
          onClick={() => {
            const confirmed = window.confirm(
              `You answered ${answeredCount} of ${totalQuestions} questions.\n\nDo you want to submit your exam?`
            )

            if (confirmed) {
              onSubmit()
            }
          }}
          disabled={submitLoading || answerLoading}
          className="flex items-center gap-3 rounded-xl bg-blue-600 px-8 py-4 text-lg font-semibold text-white shadow-lg transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitLoading || answerLoading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Submitting...
            </>
          ) : (
            <>
              <Send className="h-5 w-5" />
              Submit Exam
            </>
          )}
        </button>
      </div>
    </div>
  )
}
