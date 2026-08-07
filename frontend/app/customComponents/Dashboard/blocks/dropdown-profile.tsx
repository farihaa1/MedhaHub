"use client"

import type { ReactNode } from "react"
import Link from "next/link"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import {
  UserIcon,
  SettingsIcon,
  CreditCardIcon,
  UsersIcon,
  SquarePenIcon,
  CirclePlusIcon,
} from "lucide-react"

import { useAppSelector } from "@/app/redux/hooks"

import LogoutButton from "../../shared/Navbar/LogoutButton"
import { IUser } from "@/app/features/auth/auth.type"

type Props = {
  trigger: ReactNode
  defaultOpen?: boolean
  align?: "start" | "center" | "end"
}

export default function ProfileDropdown({
  trigger,
  defaultOpen,
  align = "end",
}: Props) {
  const { user } = useAppSelector((state) => state.auth)

  const initials =
    user?.name
      ?.split(" ")
      .map((word) => word[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "U"

  return (
    <DropdownMenu defaultOpen={defaultOpen}>
      <DropdownMenuTrigger asChild>{trigger}</DropdownMenuTrigger>

      <DropdownMenuContent className="w-80" align={align}>
        <DropdownMenuLabel className="flex items-center gap-4 px-4 py-3 font-normal">
          <div className="relative">
            <Avatar className="h-14 w-14">
              <AvatarFallback className="bg-indigo-600 text-lg font-bold text-white">
                {initials}
              </AvatarFallback>
            </Avatar>

            <span className="absolute right-0 bottom-0 block h-3 w-3 rounded-full bg-green-500 ring-2 ring-background" />
          </div>

          <div className="flex flex-1 flex-col overflow-hidden">
            <span className="truncate text-lg font-semibold">
              {user?.name || "Guest"}
            </span>

            <span className="truncate text-sm text-muted-foreground">
              {user?.email || "Not Logged In"}
            </span>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link
              href="/profile"
              className="flex items-center gap-2 px-4 py-2.5"
            >
              <UserIcon className="size-5" />
              <span>My Account</span>
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem asChild>
            <Link
              href="/settings"
              className="flex items-center gap-2 px-4 py-2.5"
            >
              <SettingsIcon className="size-5" />
              <span>Settings</span>
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem asChild>
            <Link
              href="/billing"
              className="flex items-center gap-2 px-4 py-2.5"
            >
              <CreditCardIcon className="size-5" />
              <span>Billing</span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link href="/team" className="flex items-center gap-2 px-4 py-2.5">
              <UsersIcon className="size-5" />
              <span>Manage Team</span>
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem asChild>
            <Link
              href="/customization"
              className="flex items-center gap-2 px-4 py-2.5"
            >
              <SquarePenIcon className="size-5" />
              <span>Customization</span>
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem asChild>
            <Link
              href="/team/invite"
              className="flex items-center gap-2 px-4 py-2.5"
            >
              <CirclePlusIcon className="size-5" />
              <span>Add Team Account</span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <LogoutButton className="flex w-full items-center px-4 py-2.5" />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
