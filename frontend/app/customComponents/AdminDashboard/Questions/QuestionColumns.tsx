"use client"

import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"

import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"

import { IQuestion } from "@/app/redux/api/questionsApi"

import StatusBadge from "./StatusBadge"
import DifficultyBadge from "./DifficultyBadge"
import QuestionActions from "./QuestionActions"

export const columns: ColumnDef<IQuestion>[] = [
  {
    id: "select",

    enableSorting: false,

    enableHiding: false,

    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
      />
    ),

    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
      />
    ),
  },

  {
    accessorKey: "questionText",

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
      <div className="max-w-lg truncate font-medium">
        {row.original.questionText}
      </div>
    ),
  },

  {
    accessorKey: "subjectId.title",

    header: "Subject",
  },

  {
    accessorKey: "chapterId.title",

    header: "Chapter",
  },

  {
    accessorKey: "topicId.title",

    header: "Topic",
  },

  {
    accessorKey: "difficulty",

    header: "Difficulty",

    cell: ({ row }) => <DifficultyBadge difficulty={row.original.difficulty} />,
  },

  {
    accessorKey: "status",

    header: "Status",

    cell: ({ row }) => <StatusBadge status={row.original.status} />,
  },

  {
    accessorKey: "createdAt",

    header: "Created",
  },

  {
    id: "actions",

    enableSorting: false,

    cell: ({ row }) => <QuestionActions question={row.original} />,
  },
]
