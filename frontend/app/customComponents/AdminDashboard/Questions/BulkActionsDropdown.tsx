"use client"

import {
  Archive,
  CheckCircle2,
  ChevronDown,
  Copy,
  Download,
  Trash2,
} from "lucide-react"

import { Button } from "@/components/ui/button"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface BulkActionsDropdownProps {
  selectedIds?: string[]

  onPublish?: (ids: string[]) => void

  onArchive?: (ids: string[]) => void

  onDelete?: (ids: string[]) => void

  onExport?: (ids: string[]) => void

  onDuplicate?: (ids: string[]) => void
}

export default function BulkActionsDropdown({
  selectedIds = [],
  onPublish,
  onArchive,
  onDelete,
  onExport,
  onDuplicate,
}: BulkActionsDropdownProps) {
  const disabled = selectedIds.length === 0

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" disabled={disabled}>
          Bulk Actions
          <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>{selectedIds.length} Selected</DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={() => onPublish?.(selectedIds)}>
          <CheckCircle2 className="mr-2 h-4 w-4" />
          Publish
        </DropdownMenuItem>

        <DropdownMenuItem onClick={() => onArchive?.(selectedIds)}>
          <Archive className="mr-2 h-4 w-4" />
          Archive
        </DropdownMenuItem>

        <DropdownMenuItem onClick={() => onDuplicate?.(selectedIds)}>
          <Copy className="mr-2 h-4 w-4" />
          Duplicate
        </DropdownMenuItem>

        <DropdownMenuItem onClick={() => onExport?.(selectedIds)}>
          <Download className="mr-2 h-4 w-4" />
          Export
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          className="text-destructive"
          onClick={() => onDelete?.(selectedIds)}
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
