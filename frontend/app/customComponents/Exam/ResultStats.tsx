"use client"

interface ResultStatsProps {
  result: {
    totalQuestions: number
    attempted: number
    correct: number
    wrong: number
    skipped: number
    score: number
    accuracy: number
    negativeMark: number
  }
}

export default function ResultStats({ result }: ResultStatsProps) {
  const stats = [
    {
      label: "Score",
      value: result.score,
    },
    {
      label: "Correct",
      value: result.correct,
    },
    {
      label: "Wrong",
      value: result.wrong,
    },
    {
      label: "Skipped",
      value: result.skipped,
    },
    {
      label: "Accuracy",
      value: `${result.accuracy}%`,
    },
    {
      label: "Attempted",
      value: result.attempted,
    },
  ]

  return (
    <section className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
      {stats.map((stat) => (
        <div key={stat.label} className="rounded-xl border bg-card p-4">
          <p className="text-xs text-muted-foreground">{stat.label}</p>

          <p className="mt-2 text-xl font-bold">{stat.value}</p>
        </div>
      ))}
    </section>
  )
}
