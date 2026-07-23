"use client"

import {
  Archive,
  CheckCircle2,
  FileQuestion,
  FileText,
  PlusCircle,
} from "lucide-react"

import { useGetQuestionStatsQuery } from "@/app/redux/api/questionsApi"

interface StatCardProps {
  title: string
  value: number
  icon: React.ReactNode
  description: string
}

function StatCard({ title, value, icon, description }: StatCardProps) {
  return (
    <div className="rounded-xl border bg-card p-5 shadow-sm transition-all hover:shadow-md">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>

          <h2 className="mt-2 text-3xl font-bold">{value.toLocaleString()}</h2>

          <p className="mt-1 text-xs text-muted-foreground">{description}</p>
        </div>

        <div className="rounded-lg bg-primary/10 p-3 text-primary">{icon}</div>
      </div>
    </div>
  )
}

export default function QuestionStats() {
  const { data, isLoading, isError, error } = useGetQuestionStatsQuery()


  if (isLoading) {
    return (
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {Array.from({ length: 5 }).map((_, index) => (
          <div
            key={index}
            className="h-36 animate-pulse rounded-xl border bg-muted"
          />
        ))}
      </section>
    )
  }

  if (isError) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-600">
        Failed to load question statistics.
        <br />
        {JSON.stringify(error)}
      </div>
    )
  }

  const stats = data?.data ?? {
    total: 0,
    published: 0,
    draft: 0,
    pending: 0,
    rejected: 0,
    premium: 0,
    reported: 0,
    today: 0,
  }

  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
      <StatCard
        title="Total Questions"
        value={stats.total}
        icon={<FileQuestion className="h-6 w-6" />}
        description="Questions available"
      />

      <StatCard
        title="Published"
        value={stats.published}
        icon={<CheckCircle2 className="h-6 w-6" />}
        description="Approved questions"
      />

      <StatCard
        title="Draft"
        value={stats.draft}
        icon={<FileText className="h-6 w-6" />}
        description="Draft questions"
      />

      <StatCard
        title="Pending Review"
        value={stats.pending}
        icon={<Archive className="h-6 w-6" />}
        description="Waiting for approval"
      />

      <StatCard
        title="Added Today"
        value={stats.today}
        icon={<PlusCircle className="h-6 w-6" />}
        description="Created today"
      />
    </section>
  )
}
