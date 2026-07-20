"use client"

import { ColumnDef } from "@tanstack/react-table"
import QuestionBankActions from "./items/QuestionBankItemActions"

export type QuestionBank = {
  _id: string
  title: string
  category: string
  year?: number
  totalQuestions: number
  visibility: string
  isPublished: boolean
}

export const questionBankColumns: ColumnDef<QuestionBank>[] = [
  {
    accessorKey: "title",
    header: "Title",
  },

  {
    accessorKey: "category",
    header: "Category",
  },

  {
    accessorKey: "year",
    header: "Year",
  },

  {
    accessorKey: "totalQuestions",
    header: "Questions",
  },

  {
    accessorKey: "visibility",
    header: "Visibility",
  },

  {
    accessorKey: "isPublished",
    header: "Published",
    cell: ({ row }) => (row.original.isPublished ? "Yes" : "No"),
  },

  {
    id: "actions",
    header: "Actions",

    cell: ({ row }) => <QuestionBankActions id={row.original._id} />,
  },
]
