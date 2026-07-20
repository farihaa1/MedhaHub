"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import {
  BookOpen,
  BookCopy,
  FolderTree,
  LayoutDashboard,
  FileQuestion,
  ClipboardCheck,
  Users,
  FileText,
  GraduationCap,
  BarChart3,
  Settings,
} from "lucide-react"

import { cn } from "@/lib/utils"

const sidebarItems = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    title: "Subjects",
    href: "/admin/subjects",
    icon: BookOpen,
  },
  {
    title: "Chapters",
    href: "/admin/chapters",
    icon: BookCopy,
  },
  {
    title: "Topics",
    href: "/admin/topics",
    icon: FolderTree,
  },
  {
    title: "Questions",
    href: "/admin/questions",
    icon: FileQuestion,
  },
  {
    title: "Question Approvals",
    href: "/admin/question-submissions",
    icon: ClipboardCheck,
  },
  {
    title: "Practice Sets",
    href: "/admin/practice-sets",
    icon: FileText,
  },
  {
    title: "Model Tests",
    href: "/admin/model-tests",
    icon: GraduationCap,
  },
  {
    title: "Users",
    href: "/admin/users",
    icon: Users,
  },
  {
    title: "Analytics",
    href: "/admin/analytics",
    icon: BarChart3,
  },
  {
    title: "Settings",
    href: "/admin/settings",
    icon: Settings,
  },
]

export function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="hidden w-64 border-r bg-background lg:flex lg:flex-col">
      {/* Logo */}
      <div className="border-b px-6 py-5">
        <h1 className="text-xl font-bold">MedhaHub Admin</h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-4">
        {sidebarItems.map((item) => {
          const Icon = item.icon

          const active =
            pathname === item.href || pathname.startsWith(`${item.href}/`)

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                active
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <Icon className="h-5 w-5" />
              <span>{item.title}</span>
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
