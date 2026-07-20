"use client"

import { useMemo } from "react"
import { usePathname } from "next/navigation"
import { Bell, Search, ChevronDown, LogOut, Settings, User } from "lucide-react"

import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const pageTitles: Record<string, string> = {
  "/admin": "Dashboard",
  "/admin/subjects": "Subjects",
  "/admin/chapters": "Chapters",
  "/admin/topics": "Topics",
  "/admin/questions": "Questions",
  "/admin/question-submissions": "Question Approvals",
  "/admin/practice-sets": "Practice Sets",
  "/admin/model-tests": "Model Tests",
  "/admin/users": "Users",
  "/admin/analytics": "Analytics",
  "/admin/settings": "Settings",
}

export function AdminNavbar() {
  const pathname = usePathname()

  const title = useMemo(() => {
    if (pageTitles[pathname]) return pageTitles[pathname]

    const match = Object.keys(pageTitles).find(
      (route) => route !== "/admin" && pathname.startsWith(route)
    )

    return match ? pageTitles[match] : "Admin"
  }, [pathname])

  return (
    <header className="flex h-16 items-center justify-between border-b bg-background px-6">
      {/* Left */}
      <div>
        <h1 className="text-2xl font-bold">{title}</h1>
      </div>

      {/* Right */}
      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="relative hidden md:block">
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

          <Input placeholder="Search..." className="w-72 pl-10" />
        </div>

        {/* Notifications */}
        <button className="rounded-lg p-2 transition hover:bg-muted">
          <Bell className="h-5 w-5" />
        </button>

        {/* Profile */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 rounded-lg p-1 transition hover:bg-muted">
              <Avatar className="h-9 w-9">
                <AvatarImage src="" />
                <AvatarFallback>AD</AvatarFallback>
              </Avatar>

              <div className="hidden text-left lg:block">
                <p className="text-sm font-semibold">Administrator</p>

                <p className="text-xs text-muted-foreground">
                  admin@medhahub.com
                </p>
              </div>

              <ChevronDown className="h-4 w-4" />
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              Profile
            </DropdownMenuItem>

            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem className="text-red-600">
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
