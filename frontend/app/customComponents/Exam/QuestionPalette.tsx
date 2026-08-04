"use client"

interface QuestionPaletteProps {
  questions: {
    question: {
      id: string
    }
  }[]
  answers: Record<string, string>
}

export default function QuestionPalette({
  questions,
  answers,
}: QuestionPaletteProps) {
  const scrollToQuestion = (id: string) => {
    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    })
  }

  return (
    <section className="mb-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-xl font-bold">Question Palette</h2>

        <span className="text-sm text-slate-500">Click a number to jump</span>
      </div>

      <div className="grid grid-cols-5 gap-3 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 xl:grid-cols-10">
        {questions.map((item, index) => {
          const answered = !!answers[item.question.id]

          return (
            <button
              key={item.question.id}
              onClick={() => scrollToQuestion(item.question.id)}
              className={`flex h-12 w-12 items-center justify-center rounded-xl border text-sm font-semibold transition-all duration-200 ${
                answered
                  ? "border-blue-600 bg-blue-600 text-white shadow-md hover:bg-blue-700"
                  : "border-slate-300 bg-white text-slate-700 hover:border-blue-400 hover:bg-slate-100"
              }`}
            >
              {index + 1}
            </button>
          )
        })}
      </div>

      <div className="mt-6 flex flex-wrap gap-6 text-sm">
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 rounded bg-blue-600"></div>
          <span>Answered</span>
        </div>

        <div className="flex items-center gap-2">
          <div className="h-4 w-4 rounded border bg-white"></div>
          <span>Not Answered</span>
        </div>
      </div>
    </section>
  )
}
