"use client"

import {
  Users,
  BookOpen,
  FileQuestion,
  ClipboardCheck,
  FolderTree,
  BookCopy,
} from "lucide-react"

import { DashboardCard } from "./DashboardCard"
import { useGetDashboardQuery } from "@/app/redux/api/adminApi"

export default function AdminDashboardCard() {
  const { data, isLoading } = useGetDashboardQuery()

  if (isLoading) {
    return <p>Loading...</p>
  }

  const dashboard = data?.data

  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
      <DashboardCard
        title="Users"
        value={dashboard?.totalUsers ?? 0}
        icon={<Users className="h-6 w-6 text-primary" />}
      />

      <DashboardCard
        title="Subjects"
        value={dashboard?.totalSubjects ?? 0}
        icon={<BookOpen className="h-6 w-6 text-primary" />}
      />

      <DashboardCard
        title="Chapters"
        value={dashboard?.totalChapters ?? 0}
        icon={<BookCopy className="h-6 w-6 text-primary" />}
      />

      <DashboardCard
        title="Topics"
        value={dashboard?.totalTopics ?? 0}
        icon={<FolderTree className="h-6 w-6 text-primary" />}
      />

      <DashboardCard
        title="Questions"
        value={dashboard?.totalQuestions ?? 0}
        icon={<FileQuestion className="h-6 w-6 text-primary" />}
      />

      <DashboardCard
        title="Pending Approval"
        value={dashboard?.pendingSubmissions ?? 0}
        icon={<ClipboardCheck className="h-6 w-6 text-primary" />}
      />
    </div>
  )
}
