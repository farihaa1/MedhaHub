"use client"

import Link from "next/link"

import { NavLinks } from "./NavLinks"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar"
import { iconRegistry } from "./IconRegistry"
import Image from "next/image"
import { logo } from "@/app/customComponents/shared/Navbar/NavLinks"

export default function DashboardSidebar() {
  return (
    <Sidebar >
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="pt-4">
            <Link href="/dashboard" className="flex items-center gap-2">
              <Image
                src={logo.src}
                alt={logo.title}
                width={100}
                height={100}
                className="h-auto w-auto"
              />
            </Link>
          </SidebarGroupLabel>

          <SidebarGroupContent className="py-8">
            <SidebarMenu>
              {NavLinks.map((item) => {
                const Icon =
                  iconRegistry[item.icon as keyof typeof iconRegistry]

                return (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton asChild>
                      <Link href={item.url} className="flex items-center gap-2">
                        {Icon && <Icon className="h-4 w-4" />}
                        <span>{item.label_bn}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
