"use client"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { Button } from "@/components/ui/button"

export default function BulkActionsDropdown() {
  const selectedCount = 0 // Replace with table selection state

  if (!selectedCount) return null

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="secondary">Bulk Actions</Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        <DropdownMenuItem>Publish</DropdownMenuItem>

        <DropdownMenuItem>Move to Draft</DropdownMenuItem>

        <DropdownMenuItem>Mark Premium</DropdownMenuItem>

        <DropdownMenuItem>Export Selected</DropdownMenuItem>

        <DropdownMenuItem className="text-red-600">
          Delete Selected
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
