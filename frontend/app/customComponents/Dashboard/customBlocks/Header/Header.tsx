"use client"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"

import ProfileDropdown from "@/app/customComponents/Dashboard/blocks/dropdown-profile"
import { ThemeToggle } from "@/app/customComponents/shared/ThemeToggle"

import { useAppSelector } from "@/app/redux/hooks"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function Header() {
  const { user, isLoading } = useAppSelector((state) => state.auth)

  const userName = user?.name || "ব্যবহারকারী"

  const firstLetter = userName.charAt(0).toUpperCase()

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b bg-background px-4">
      {/* Left */}

      <div className="flex items-center gap-2">
        <SidebarTrigger />

        <Separator orientation="vertical" className="hidden h-5 sm:block" />

        <Breadcrumb className="hidden sm:block">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">হোম</BreadcrumbLink>
            </BreadcrumbItem>

            <BreadcrumbSeparator />

            <BreadcrumbItem>
              <BreadcrumbLink href="/dashboard">ড্যাশবোর্ড</BreadcrumbLink>
            </BreadcrumbItem>

            <BreadcrumbSeparator />

            <BreadcrumbItem>
              <BreadcrumbPage>ফ্রি</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* Right */}

      <div className="flex items-center gap-2">
        <ThemeToggle />

        {!isLoading && (
          <ProfileDropdown
            trigger={
              <button
                type="button"
                className="rounded-full ring-offset-background outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                aria-label="Open profile menu"
              >
                <Avatar className="size-10">
                  <AvatarImage src={user?.profileImage || ""} alt={userName} />

                  <AvatarFallback className="bg-blue-600 font-semibold text-white">
                    {firstLetter}
                  </AvatarFallback>
                </Avatar>
              </button>
            }
          />
        )}
      </div>
    </header>
  )
}
