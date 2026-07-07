"use client"

import { useSearchParams } from "next/navigation"
import { generateExam } from "@/lib/exam/generateExam"
import { useExam } from "@/hooks/useExam"
import { questions } from "@/app/data/questionData"

export default function ExamPage() {
  const searchParams = useSearchParams()

  const subjectId = searchParams.get("subjectId") ?? ""

  const topicIds = (searchParams.get("topics") ?? "").split(",").filter(Boolean)

  const questionCount = Number(searchParams.get("count") ?? 20)

  const exam = generateExam({
    subjectId,
    topicIds,
    questionCount,
  })
  const examQuestions = exam.questionIds
    .map((id) => questions.find((q) => q.id === id))
    .filter((q): q is (typeof questions)[number] => q !== undefined)
  const {
    answers,
    handleAnswer,
    submitExam,
    submitted,
    result,
    answeredCount,
    minutes,
    seconds,
  } = useExam({
    exam,
    questions: examQuestions,
  })

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      {/* Header */}

      <header className="sticky top-0 z-20 border-b border-slate-800 bg-slate-900">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-8 py-5">
          <div>
            <h1 className="text-2xl font-bold">MedhaHub Practice Exam</h1>

            <p className="text-sm text-slate-400">
              Answered {answeredCount} / {examQuestions.length}
            </p>
          </div>

          <div className="rounded-xl bg-emerald-600 px-6 py-3 text-xl font-bold">
            {minutes}:{seconds.toString().padStart(2, "0")}
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl p-8">
       { examQuestions.map((question, optionIndex) => {
          const answered = answers[question.id] !== undefined

          return (
            <section
              key={question.id}
              className="mb-8 rounded-2xl border border-slate-800 bg-slate-900 p-6"
            >
              <h2 className="mb-6 text-xl font-semibold">
                Question {optionIndex + 1}
              </h2>

              <p className="mb-8 text-lg">{question.question}</p>

              <div className="space-y-4">
                {question.options.map((option) => {
                  const selected = answers[question.id] === option.id

                  return (
                    <button
                      key={option.id}
                      disabled={answered}
                      onClick={() => handleAnswer(question.id, option.id)}
                      className={`flex w-full items-center gap-4 rounded-xl border p-4 text-left transition ${
                        selected
                          ? "border-emerald-500 bg-emerald-500/20"
                          : "border-slate-700 hover:border-emerald-400"
                      } ${answered ? "cursor-not-allowed" : ""} `}
                    >
                      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-800 font-bold">
                        {String.fromCharCode(65 + optionIndex)}
                      </span>

                      <span>{option.text}</span>

                      {selected && (
                        <span className="ml-auto rounded bg-emerald-600 px-3 py-1 text-sm">
                          Selected
                        </span>
                      )}
                    </button>
                  )
                })}
              </div>
            </section>
          )
        })}

        {/* Submit */}

        {!submitted && (
          <button
            onClick={submitExam}
            className="mt-10 w-full rounded-xl bg-emerald-600 py-4 text-lg font-semibold hover:bg-emerald-700"
          >
            Submit Exam
          </button>
        )}

        {/* Result */}

        {submitted && (
          <div className="mt-10 rounded-2xl border border-emerald-500 bg-emerald-500/10 p-8">
            <h2 className="mb-6 text-3xl font-bold">Exam Result</h2>

            <div className="grid grid-cols-2 gap-6 md:grid-cols-5">
              <div className="rounded-xl bg-slate-900 p-5">
                <p className="text-slate-400">Total</p>

                <h3 className="mt-2 text-3xl font-bold">{result.total}</h3>
              </div>

              <div className="rounded-xl bg-slate-900 p-5">
                <p className="text-slate-400">Correct</p>

                <h3 className="mt-2 text-3xl font-bold text-emerald-400">
                  {result.correct}
                </h3>
              </div>

              <div className="rounded-xl bg-slate-900 p-5">
                <p className="text-slate-400">Wrong</p>

                <h3 className="mt-2 text-3xl font-bold text-red-400">
                  {result.wrong}
                </h3>
              </div>

              <div className="rounded-xl bg-slate-900 p-5">
                <p className="text-slate-400">Skipped</p>

                <h3 className="mt-2 text-3xl font-bold text-yellow-400">
                  {result.skipped}
                </h3>
              </div>

              <div className="rounded-xl bg-slate-900 p-5">
                <p className="text-slate-400">Score</p>

                <h3 className="mt-2 text-3xl font-bold text-cyan-400">
                  {result.percentage}%
                </h3>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
