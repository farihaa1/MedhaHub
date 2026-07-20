"use client"

import { ColumnDef } from "@tanstack/react-table"
import { useState } from "react"

import { Pencil, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"

import EditQuestionBankItemDialog from "./EditQuestionBankItemDialog"
import RemoveQuestionDialog from "./RemoveQuestionDialog"

export interface IQuestionBankItem {
  _id: string

  questionBank: string

  order: number

  marks: number

  negativeMarks?: number

  question: {
    _id: string

    question: string

    subject?: {
      name: string
    }

    chapter?: {
      name: string
    }
  }
}

export const questionBankItemColumns: ColumnDef<IQuestionBankItem>[] = [
  {
    accessorKey: "order",

    header: "Order",
  },

  {
    header: "Question",

    cell: ({ row }) => (
      <div className="max-w-xl">{row.original.question.question}</div>
    ),
  },

  {
    header: "Subject",

    cell: ({ row }) => row.original.question.subject?.name ?? "-",
  },

  {
    header: "Chapter",

    cell: ({ row }) => row.original.question.chapter?.name ?? "-",
  },

  {
    accessorKey: "marks",

    header: "Marks",
  },

  {
    accessorKey: "negativeMarks",

    header: "Negative",
  },

  {
    id: "actions",

    header: "Actions",

    cell: ({ row }) => <QuestionBankItemActions item={row.original} />,
  },
]

function QuestionBankItemActions({ item }: { item: IQuestionBankItem }) {
  const [editOpen, setEditOpen] = useState(false)

  const [deleteOpen, setDeleteOpen] = useState(false)

  return (
    <>
      <div className="flex gap-2">
        <Button
          size="icon"

          variant="outline"

          onClick={() => setEditOpen(true)}
        >
          <Pencil className="h-4 w-4" />
        </Button>

        <Button
          size="icon"

          variant="destructive"

          onClick={() => setDeleteOpen(true)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      <EditQuestionBankItemDialog
        open={editOpen}

        onOpenChange={setEditOpen}

        item={item}
      />

      <RemoveQuestionDialog
        open={deleteOpen}

        onOpenChange={setDeleteOpen}

        questionBankId={item.questionBank}

        questionId={item.question._id}
      />
    </>
  )
}
