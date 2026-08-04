"use client"

interface ExamHeaderProps {
  answeredCount: number
  totalQuestions: number
  progress: number
  timeLeft: number
}

export default function ExamHeader({
  answeredCount,
  totalQuestions,
  progress,
  timeLeft,
}: ExamHeaderProps) {
  const minutes = Math.floor(timeLeft / 60)
  const seconds = timeLeft % 60

  const formattedTime = `${String(minutes).padStart(2, "0")}:${String(
    seconds
  ).padStart(2, "0")}`

  const timerColor =
    timeLeft <= 60
      ? "bg-red-500"
      : timeLeft <= 300
        ? "bg-orange-500"
        : "bg-emerald-500"

  return (
    <header className="sticky top-4 z-50 mb-8 rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-xl backdrop-blur">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        {/* Left */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Practice Exam</h1>

          <p className="mt-2 text-slate-500">
            Complete all questions before submitting.
          </p>
        </div>

        {/* Right */}
        <div className="flex flex-wrap gap-4">
          <div className="rounded-2xl bg-blue-600 px-6 py-4 text-white shadow">
            <p className="text-sm opacity-90">Answered</p>

            <h2 className="text-3xl font-bold">
              {answeredCount}/{totalQuestions}
            </h2>
          </div>

          <div
            className={`rounded-2xl px-6 py-4 text-white shadow ${timerColor}`}
          >
            <p className="text-sm opacity-90">Time Left</p>

            <h2 className="text-3xl font-bold">{formattedTime}</h2>
          </div>
        </div>
      </div>

      {/* Progress */}

      <div className="mt-8">
        <div className="mb-2 flex items-center justify-between text-sm text-slate-600">
          <span>Progress</span>

          <span>{Math.round(progress)}%</span>
        </div>

        <div className="h-3 overflow-hidden rounded-full bg-slate-200">
          <div
            className="h-full rounded-full bg-blue-600 transition-all duration-500"
            style={{
              width: `${progress}%`,
            }}
          />
        </div>
      </div>
    </header>
  )
}
