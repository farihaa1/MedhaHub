"use client"

import { Bell, RefreshCcw, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { format } from "date-fns"
import { Card, CardContent } from "@/components/ui/card"

export default function DashboardHeader() {
  const today = format(new Date(), "EEEE, MMMM dd yyyy")

  return (
    <Card>
      <CardContent className="flex flex-col gap-4 p-6 lg:flex-row lg:items-center lg:justify-between">
        {/* Left Section */}
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Admin Dashboard</h1>

          <p className="text-sm text-muted-foreground">
            Monitor MedhaHub platform performance and activity
          </p>

          <p className="mt-1 text-xs text-muted-foreground">{today}</p>
        </div>

        {/* Right Section */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          {/* Search */}
          <div className="relative">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

            <Input
              placeholder="Search users, questions..."
              className="w-full pl-9 sm:w-[260px]"
            />
          </div>

          {/* Refresh */}
          <Button variant="outline" size="icon">
            <RefreshCcw className="h-4 w-4" />
          </Button>

          {/* Notification */}
          <Button variant="outline" size="icon">
            <Bell className="h-4 w-4" />
          </Button>

          {/* Admin Profile */}
          <Avatar>
            <AvatarImage src="/avatar.png" />

            <AvatarFallback>AD</AvatarFallback>
          </Avatar>
        </div>
      </CardContent>
    </Card>
  )
}
