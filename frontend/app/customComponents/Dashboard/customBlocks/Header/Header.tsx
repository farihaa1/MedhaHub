"use client"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"

import ProfileDropdown from "@/app/customComponents/Dashboard/blocks/dropdown-profile"
import { ThemeToggle } from "@/app/customComponents/shared/ThemeToggle"
import { useAppSelector } from "@/app/redux/hooks"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function Header() {
  const { user } = useAppSelector((state) => state.auth)

  const userName = user?.name || "ব্যবহারকারী"
  const firstLetter = userName.charAt(0).toUpperCase()

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6">
        {/* Left */}
        <div className="flex items-center gap-3">
          <SidebarTrigger />

          <Separator orientation="vertical" className="hidden h-5 sm:block" />

          <Breadcrumb className="hidden sm:block">
            <BreadcrumbList>
              {/* Home */}
              <BreadcrumbItem>
                <BreadcrumbLink href="/">হোম</BreadcrumbLink>
              </BreadcrumbItem>

              <BreadcrumbSeparator />

              {/* Dashboard */}
              <BreadcrumbItem>
                <BreadcrumbLink href="/dashboard">ড্যাশবোর্ড</BreadcrumbLink>
              </BreadcrumbItem>

              <BreadcrumbSeparator />

              {/* Current */}
              <BreadcrumbItem>
                <BreadcrumbPage>ফ্রি</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        {/* Right */}
        <div className="flex items-center gap-2">
          {/* Theme */}
          <ThemeToggle />

          {/* Profile */}
          <ProfileDropdown
            trigger={
              <Button variant="ghost" size="icon-lg" className="rounded-full">
                <Avatar className="size-10">
                  <AvatarImage src={user?.profileImage || ""} alt={userName} />

                  <AvatarFallback className="bg-blue-600 font-semibold text-white">
                    {firstLetter}
                  </AvatarFallback>
                </Avatar>
              </Button>
            }
          />
        </div>
      </div>
    </header>
  )
}
