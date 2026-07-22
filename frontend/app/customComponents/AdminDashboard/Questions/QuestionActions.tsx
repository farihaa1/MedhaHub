"use client"

import {
  MoreHorizontal,
  Eye,
  Pencil,
  Copy,
  Trash2,
  BarChart3,
  History,
} from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { Button } from "@/components/ui/button"

import { IQuestion } from "@/app/redux/api/questionsApi"

interface Props {
  question: IQuestion
}

export default function QuestionActions({ question }: Props) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="icon" variant="ghost">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        <DropdownMenuItem>
          <Eye className="mr-2 h-4 w-4" />
          Preview
        </DropdownMenuItem>

        <DropdownMenuItem>
          <Pencil className="mr-2 h-4 w-4" />
          Edit
        </DropdownMenuItem>

        <DropdownMenuItem>
          <Copy className="mr-2 h-4 w-4" />
          Duplicate
        </DropdownMenuItem>

        <DropdownMenuItem>
          <BarChart3 className="mr-2 h-4 w-4" />
          Analytics
        </DropdownMenuItem>

        <DropdownMenuItem>
          <History className="mr-2 h-4 w-4" />
          History
        </DropdownMenuItem>

        <DropdownMenuItem className="text-red-600">
          <Trash2 className="mr-2 h-4 w-4" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
