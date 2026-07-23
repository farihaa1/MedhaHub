"use client"

import { ColumnDef } from "@tanstack/react-table"

import { Checkbox } from "@/components/ui/checkbox"

import QuestionActions from "./QuestionActions"
import StatusBadge from "./StatusBadge"
import DifficultyBadge from "./DifficultyBadge"
import { IQuestionSource } from "@/app/redux/api/questionsApi"

export interface IQuestionRow {
  _id: string
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

  type: string

  difficulty?: string

  status: string

  source: IQuestionSource[]

  marks: number

  createdAt: string
}

export const columns: ColumnDef<IQuestionRow>[] = [
  {
    id: "select",

    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}

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

    header: "Question",

    cell: ({ row }) => (
      <div className="max-w-md">
        <p className="line-clamp-2 font-medium">{row.original.question}</p>
      </div>
    ),
  },

  {
    accessorKey: "subject.name",

    header: "Subject",

    cell: ({ row }) => <span>{row.original.subject?.name ?? "-"}</span>,
  },

  {
    accessorKey: "chapter.name",

    header: "Chapter",

    cell: ({ row }) => <span>{row.original.chapter?.name ?? "-"}</span>,
  },

  {
    accessorKey: "topic.name",

    header: "Topic",

    cell: ({ row }) => <span>{row.original.topic?.name ?? "-"}</span>,
  },

  {
    accessorKey: "difficulty",

    header: "Difficulty",

    cell: ({ row }) => (
      <DifficultyBadge difficulty={row.original.difficulty ?? ""} />
    ),
  },

  // {
  //   accessorKey: "status",

  //   header: "Status",

  //   cell: ({ row }) => <StatusBadge status={row.original.status} />,
  // },

  {
    accessorKey: "source",

    header: "Source",

    cell: ({ row }) => {
      const sources = row.original.source

      return (
        <div className="space-y-1">
          {sources.length > 0
            ? sources.map((source, index) => (
                <div key={index} className="text-sm">
                  {source.type}

                  {source.year && (
                    <span className="text-muted-foreground">
                      {" "}
                      ({source.year})
                    </span>
                  )}
                </div>
              ))
            : "-"}
        </div>
      )
    },
  },

  
  {
    id: "actions",

    header: "",

    cell: ({ row }) => <QuestionActions question={row.original} />,

    enableSorting: false,
  },
]
