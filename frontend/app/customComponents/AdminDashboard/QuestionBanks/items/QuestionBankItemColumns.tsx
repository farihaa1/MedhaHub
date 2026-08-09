"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { useState } from "react"

import { Pencil, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"

import EditQuestionBankItemDialog from "./EditQuestionBankItemDialog"
import RemoveQuestionDialog from "./RemoveQuestionDialog"

import type { IQuestionBankItem } from "@/app/redux/types/questionBank.types"

export const questionBankItemColumns: ColumnDef<IQuestionBankItem>[] = [
  {
    accessorKey: "order",
    header: "Order",
  },

  {
    id: "question",
    header: "Question",
    cell: ({ row }) => (
      <div className="max-w-xl whitespace-normal">
        {row.original.question.questionText}
      </div>
    ),
  },

  {
    id: "subject",
    header: "Subject",
    cell: ({ row }) => row.original.question.subjectId?.title ?? "-",
  },

  {
    id: "chapter",
    header: "Chapter",
    cell: ({ row }) => row.original.question.chapterId?.title ?? "-",
  },

  {
    accessorKey: "marks",
    header: "Marks",
  },

  {
    accessorKey: "negativeMarks",
    header: "Negative",
    cell: ({ row }) => row.original.negativeMarks ?? 0,
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
      <div className="flex items-center gap-2">
        <Button
          size="icon"
          variant="outline"
          onClick={() => setEditOpen(true)}
          aria-label="Edit question"
        >
          <Pencil className="h-4 w-4" />
        </Button>

        <Button
          size="icon"
          variant="destructive"
          onClick={() => setDeleteOpen(true)}
          aria-label="Remove question"
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
