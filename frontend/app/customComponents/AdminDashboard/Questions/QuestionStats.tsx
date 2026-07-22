"use client"

import {
  FileQuestion,
  CheckCircle2,
  FileEdit,
  Clock3,
  XCircle,
  Crown,
  Flag,
  CalendarPlus,
} from "lucide-react"

import QuestionStatCard from "./QuestionStatCard"
import QuestionStatsSkeleton from "./QuestionStatsSkeleton"

export default function QuestionStats() {
  const { data, isLoading } = useGetQuestionStatsQuery()

  if (isLoading) {
    return <QuestionStatsSkeleton />
  }

  const stats = data?.data

  if (!stats) return null

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <QuestionStatCard
        title="Total Questions"
        value={stats.total}
        icon={<FileQuestion className="size-7 text-primary" />}
      />

      <QuestionStatCard
        title="Published"
        value={stats.published}
        icon={<CheckCircle2 className="size-7 text-green-500" />}
      />

      <QuestionStatCard
        title="Draft"
        value={stats.draft}
        icon={<FileEdit className="size-7 text-orange-500" />}
      />

      <QuestionStatCard
        title="Pending"
        value={stats.pending}
        icon={<Clock3 className="size-7 text-yellow-500" />}
      />

      <QuestionStatCard
        title="Rejected"
        value={stats.rejected}
        icon={<XCircle className="size-7 text-red-500" />}
      />

      <QuestionStatCard
        title="Premium"
        value={stats.premium}
        icon={<Crown className="size-7 text-amber-500" />}
      />

      <QuestionStatCard
        title="Reported"
        value={stats.reported}
        icon={<Flag className="size-7 text-red-500" />}
      />

      <QuestionStatCard
        title="Added Today"
        value={stats.today}
        icon={<CalendarPlus className="size-7 text-sky-500" />}
      />
    </div>
  )
}
