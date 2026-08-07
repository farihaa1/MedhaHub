"use client"

import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import QuestionActions from "./QuestionActions"
import {
  IQuestion,
  QuestionDifficulty,
  QuestionStatus,
} from "@/app/redux/api/questionsApi"

export interface IQuestionRow {
  _id: string
  original: IQuestion
  question: string
  subject?: {
    _id: string
    name: string
  }
  chapter?: {
    _id: string
    name: string
  }
  topic?: {
    _id: string
    name: string
  }
  difficulty: QuestionDifficulty
  status: QuestionStatus
  source: {
    type: string
    name: string
    year?: number
  }[]
  createdAt: string
}

const difficultyVariant = (
  difficulty: QuestionDifficulty
): "default" | "secondary" | "destructive" | "outline" => {
  switch (difficulty) {
    case QuestionDifficulty.EASY:
      return "secondary"

    case QuestionDifficulty.MEDIUM:
      return "outline"

    case QuestionDifficulty.HARD:
      return "destructive"

    default:
      return "default"
  }
}

const statusVariant = (
  status: QuestionStatus
): "default" | "secondary" | "destructive" | "outline" => {
  switch (status) {
    case QuestionStatus.APPROVED:
      return "default"

    case QuestionStatus.PENDING:
      return "secondary"

    case QuestionStatus.REJECTED:
      return "destructive"

    default:
      return "outline"
  }
}

export const columns: ColumnDef<IQuestionRow>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),

    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },

  {
    accessorKey: "question",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Question
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="max-w-md truncate font-medium">
        {row.original.question}
      </div>
    ),
  },

  {
    accessorKey: "subject",
    header: "Subject",
    cell: ({ row }) => row.original.subject?.name ?? "-",
  },

  {
    accessorKey: "chapter",
    header: "Chapter",
    cell: ({ row }) => row.original.chapter?.name ?? "-",
  },

  {
    accessorKey: "topic",
    header: "Topic",
    cell: ({ row }) => row.original.topic?.name ?? "-",
  },

  // {
  //   accessorKey: "status",
  //   header: "Status",
  //   cell: ({ row }) => (
  //     <Badge variant={statusVariant(row.original.status)}>
  //       {row.original.status}
  //     </Badge>
  //   ),
  // },

  {
    id: "actions",
    header: "",
    cell: ({ row }) => <QuestionActions question={row.original.original} />,
    enableSorting: false,
  },
]
