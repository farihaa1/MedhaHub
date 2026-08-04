import {
  Award,
  BookOpen,
  CheckCircle2,
  Target,
  Trophy,
  XCircle,
} from "lucide-react"

interface Result {
  totalQuestions: number
  attempted: number
  correct: number
  wrong: number
  skipped: number
  score: number
  accuracy: number
  negativeMark: number
}

interface Props {
  result: Result
}

export default function ResultStats({ result }: Props) {
  const stats = [
    {
      title: "Score",
      value: result.score,
      icon: Trophy,
      color: "text-yellow-600",
      bg: "bg-yellow-50",
    },
    {
      title: "Accuracy",
      value: `${result.accuracy}%`,
      icon: Target,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      title: "Correct",
      value: result.correct,
      icon: CheckCircle2,
      color: "text-green-600",
      bg: "bg-green-50",
    },
    {
      title: "Wrong",
      value: result.wrong,
      icon: XCircle,
      color: "text-red-600",
      bg: "bg-red-50",
    },
    {
      title: "Attempted",
      value: result.attempted,
      icon: BookOpen,
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
    {
      title: "Skipped",
      value: result.skipped,
      icon: Award,
      color: "text-orange-600",
      bg: "bg-orange-50",
    },
    {
      title: "Total Questions",
      value: result.totalQuestions,
      icon: BookOpen,
      color: "text-gray-700",
      bg: "bg-gray-100",
    },
    {
      title: "Negative Mark",
      value: result.negativeMark,
      icon: XCircle,
      color: "text-pink-600",
      bg: "bg-pink-50",
    },
  ]

  return (
    <section className="rounded-2xl border bg-white p-8 shadow-sm">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">🎉 Exam Result</h1>

        <p className="mt-2 text-sm text-muted-foreground">
          Here is your complete exam performance summary.
        </p>
      </div>

      {/* Progress */}

      <div className="mb-8">
        <div className="mb-2 flex justify-between text-sm">
          <span>Accuracy</span>

          <span>{result.accuracy}%</span>
        </div>

        <div className="h-3 overflow-hidden rounded-full bg-gray-200">
          <div
            className="h-full rounded-full bg-green-500 transition-all duration-500"
            style={{
              width: `${result.accuracy}%`,
            }}
          />
        </div>
      </div>

      {/* Stats */}

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((item) => {
          const Icon = item.icon

          return (
            <div
              key={item.title}
              className={`${item.bg} rounded-xl border p-5`}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">
                  {item.title}
                </span>

                <Icon className={`h-6 w-6 ${item.color}`} />
              </div>

              <h2 className={`mt-4 text-3xl font-bold ${item.color}`}>
                {item.value}
              </h2>
            </div>
          )
        })}
      </div>
    </section>
  )
}
