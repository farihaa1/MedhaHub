"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b bg-card">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-4 py-2 sm:px-6">
        {/* Left */}
        <div className="flex items-center gap-4">
          <SidebarTrigger className="[&_svg]:size-5" />

          <Separator
            orientation="vertical"
            className="hidden h-4 sm:block"
          />

          <Breadcrumb className="hidden sm:block">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Home</BreadcrumbLink>
              </BreadcrumbItem>

              <BreadcrumbSeparator />

              <BreadcrumbItem>
                <BreadcrumbLink href="/dashboard">
                  Dashboard
                </BreadcrumbLink>
              </BreadcrumbItem>

              <BreadcrumbSeparator />

              <BreadcrumbItem>
                <BreadcrumbPage>Free</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        {/* Right */}
        <div className="flex items-center gap-2">
          <ThemeToggle />

          <ProfileDropdown
            trigger={
              <Button variant="ghost" size="icon-lg">
                <Avatar className="size-10">
                  <AvatarImage src="https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-1.png" />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
              </Button>
            }
          />
        </div>
      </div>
    </header>
  )
}