"use client"

import { Eye, Pencil, Trash2, BookOpen, MoreHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { IQuestionBank } from "@/app/redux/types/questionBank.types"

interface Props {
  bank: IQuestionBank

  onView?: (bank: IQuestionBank) => void

  onEdit?: (bank: IQuestionBank) => void

  onDelete?: (bank: IQuestionBank) => void

  onManageQuestions?: (bank: IQuestionBank) => void
}

export default function QuestionBankActions({
  bank,

  onView,

  onEdit,

  onDelete,

  onManageQuestions,
}: Props) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="icon" variant="ghost">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => onView?.(bank)}>
          <Eye className="mr-2 h-4 w-4" />
          View
        </DropdownMenuItem>

        <DropdownMenuItem onClick={() => onManageQuestions?.(bank)}>
          <BookOpen className="mr-2 h-4 w-4" />
          Manage Questions
        </DropdownMenuItem>

        <DropdownMenuItem onClick={() => onEdit?.(bank)}>
          <Pencil className="mr-2 h-4 w-4" />
          Edit
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => onDelete?.(bank)}
          className="text-red-600 focus:bg-red-50 focus:text-red-600"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
