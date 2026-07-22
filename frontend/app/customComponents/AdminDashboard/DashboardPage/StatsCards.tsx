"use client"

import {
  Users,
  BookOpen,
  FileQuestion,
  Layers,
  FolderTree,
  ClipboardCheck,
} from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"

import { Skeleton } from "@/components/ui/skeleton"

import { useGetDashboardQuery } from "@/app/redux/api/adminApi"

const statsConfig = [
  {
    key: "totalUsers",
    title: "Total Users",
    icon: Users,
  },

  {
    key: "totalSubjects",
    title: "Subjects",
    icon: Layers,
  },

  {
    key: "totalChapters",
    title: "Chapters",
    icon: FolderTree,
  },

  {
    key: "totalTopics",
    title: "Topics",
    icon: BookOpen,
  },

  {
    key: "totalQuestions",
    title: "Questions",
    icon: FileQuestion,
  },

  {
    key: "pendingSubmissions",
    title: "Pending Reviews",
    icon: ClipboardCheck,
  },
]

export default function StatsCards() {
  const { data, isLoading, isError } = useGetDashboardQuery()

  const dashboard = data?.data

  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({
          length: 6,
        }).map((_, index) => (
          <Card key={index}>
            <CardContent className="space-y-3 p-6">
              <Skeleton className="h-4 w-28" />

              <Skeleton className="h-8 w-20" />

              <Skeleton className="h-3 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (isError || !dashboard) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-sm text-destructive">
            Failed to load dashboard statistics
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      {statsConfig.map((item) => {
        const Icon = item.icon

        const value = dashboard[item.key as keyof typeof dashboard]

        return (
          <Card key={item.key} className="transition hover:shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{item.title}</p>

                  <h2 className="mt-2 text-3xl font-bold">
                    {value.toLocaleString()}
                  </h2>
                </div>

                <div className="rounded-lg bg-primary/10 p-3">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
