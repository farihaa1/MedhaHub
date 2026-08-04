"use client"

import Link from "next/link"
import {
  BookOpen,
  Library,
  FileQuestion,
  GraduationCap,
  FolderTree,
  ClipboardList,
  Users,
  ShieldCheck,
  BarChart3,
  Settings,
  Bell,
  Database,
  ChevronRight,
} from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"

const pages = [
  {
    title: "Subjects",
    description: "Manage subjects",
    href: "/admin/subjects",
    icon: BookOpen,
  },
  {
    title: "Chapters & Topics",
    description: "Organize syllabus",
    href: "/admin/admin_chapters_and_topics",
    icon: FolderTree,
  },
  {
    title: "Questions",
    description: "Question database",
    href: "/admin/questions",
    icon: FileQuestion,
  },
  {
    title: "Question Banks",
    description: "BCS, Bank, NTRCA...",
    href: "/admin/question-banks",
    icon: Library,
  },
  {
    title: "Practice Sets",
    description: "Practice collections",
    href: "/admin/practice-sets",
    icon: ClipboardList,
  },
  {
    title: "Model Tests",
    description: "Manage exams",
    href: "/admin/model-tests",
    icon: GraduationCap,
  },
  {
    title: "Users",
    description: "Students & Admins",
    href: "/admin/users",
    icon: Users,
  },
  {
    title: "Question Review",
    description: "Pending approvals",
    href: "/admin/review",
    icon: ShieldCheck,
  },
  {
    title: "Analytics",
    description: "Platform insights",
    href: "/admin/analytics",
    icon: BarChart3,
  },
  {
    title: "Notifications",
    description: "Announcements",
    href: "/admin/notifications",
    icon: Bell,
  },
  {
    title: "Database",
    description: "Backup & Import",
    href: "/admin/database",
    icon: Database,
  },
  {
    title: "Settings",
    description: "Platform settings",
    href: "/admin/settings",
    icon: Settings,
  },
]

export default function DashboardAllPages() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {pages.map((page) => {
        const Icon = page.icon

        return (
          <Link key={page.href} href={page.href}>
            <Card className="group h-full transition-all hover:-translate-y-1 hover:border-primary hover:shadow-lg">
              <CardContent className="flex items-center justify-between p-5">
                <div className="flex items-center gap-4">
                  <div className="rounded-xl bg-primary/10 p-3">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>

                  <div>
                    <h3 className="font-semibold">{page.title}</h3>

                    <p className="text-sm text-muted-foreground">
                      {page.description}
                    </p>
                  </div>
                </div>

                <ChevronRight className="h-5 w-5 text-muted-foreground transition group-hover:translate-x-1" />
              </CardContent>
            </Card>
          </Link>
        )
      })}
    </div>
  )
}
