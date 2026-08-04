"use client"

import {
  FileQuestion,
  CheckCircle2,
  Clock3,
  Archive,
  AlertCircle,
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { useGetQuestionStatsQuery } from "@/app/redux/api/questionsApi"

interface StatCardProps {
  title: string
  value: number
  icon: React.ReactNode
}

function StatCard({ title, value, icon }: StatCardProps) {
  return (
    <Card>
      <CardContent className="flex items-center justify-between p-6">
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>

          <h2 className="mt-2 text-3xl font-bold">{value}</h2>
        </div>

        <div className="rounded-lg bg-primary/10 p-3">{icon}</div>
      </CardContent>
    </Card>
  )
}

function LoadingCard() {
  return (
    <Card>
      <CardContent className="p-6">
        <Skeleton className="mb-3 h-4 w-20" />
        <Skeleton className="h-8 w-16" />
      </CardContent>
    </Card>
  )
}

export default function QuestionStats() {
  const { data, isLoading } = useGetQuestionStatsQuery()

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-5">
        {Array.from({ length: 5 }).map((_, i) => (
          <LoadingCard key={i} />
        ))}
      </div>
    )
  }

  const stats = data?.data

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Total Questions"
        value={stats?.total ?? 0}
        icon={<FileQuestion className="h-5 w-5 text-primary" />}
      />

      <StatCard
        title="Published"
        value={stats?.published ?? 0}
        icon={<CheckCircle2 className="h-5 w-5 text-green-600" />}
      />

      <StatCard
        title="Pending"
        value={stats?.pending ?? 0}
        icon={<Clock3 className="h-5 w-5 text-yellow-600" />}
      />

      <StatCard
        title="Draft"
        value={stats?.draft ?? 0}
        icon={<AlertCircle className="h-5 w-5 text-orange-600" />}
      />

      {/* <StatCard
        title="Archived"
        value={stats?.archived ?? 0}
        icon={<Archive className="h-6 w-6 text-gray-600" />}
      /> */}
    </div>
  )
}
