"use client"

import { BookOpen, FolderTree, LibraryBig, FileQuestion } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

import { useGetSubjectsQuery } from "@/app/redux/api/subjectsApi"
import { useGetChaptersQuery } from "@/app/redux/api/chaptersApi"
import { useGetTopicsQuery } from "@/app/redux/api/topicsApi"
import { useGetQuestionsQuery } from "@/app/redux/api/questionsApi"

export default function AcademicStats() {
  const { data: subjectsData } = useGetSubjectsQuery()

  const { data: chaptersData } = useGetChaptersQuery()

  const { data: topicsData } = useGetTopicsQuery()

  const { data: questionsData } = useGetQuestionsQuery(undefined)

  const stats = [
    {
      title: "Subjects",
      value: subjectsData?.data?.length ?? 0,
      icon: BookOpen,
      color: "text-blue-600",
    },
    {
      title: "Chapters",
      value: chaptersData?.data?.length ?? 0,
      icon: FolderTree,
      color: "text-emerald-600",
    },
    {
      title: "Topics",
      value: topicsData?.data?.length ?? 0,
      icon: LibraryBig,
      color: "text-orange-600",
    },
    {
      title: "Questions",
      value: questionsData?.data?.length ?? 0,
      icon: FileQuestion,
      color: "text-violet-600",
    },
  ]

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((item) => {
        const Icon = item.icon

        return (
          <Card key={item.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {item.title}
              </CardTitle>

              <Icon className={`h-5 w-5 ${item.color}`} />
            </CardHeader>

            <CardContent>
              <div className="text-3xl font-bold">
                {item.value.toLocaleString()}
              </div>

              <p className="mt-1 text-xs text-muted-foreground">
                Total {item.title.toLowerCase()}
              </p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
