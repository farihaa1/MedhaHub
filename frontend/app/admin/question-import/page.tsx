
"use client"

export default function QuestionImportPage() {
  return (
    <main className="min-h-screen p-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight">
            Question Import
          </h1>

          <p className="mt-2 text-muted-foreground">
            Import questions from a file and add them to your question bank.
          </p>
        </div>

        <section className="rounded-2xl border bg-card p-6 shadow-sm">
          <h2 className="text-xl font-semibold">
            Import Questions
          </h2>

          <p className="mt-2 text-sm text-muted-foreground">
            Upload your question file to begin importing questions.
          </p>
        </section>
      </div>
    </main>
  )
}
