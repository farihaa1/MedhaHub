"use client"

import { ColumnDef } from "@tanstack/react-table"

import { ISubject } from "@/app/(dashboard)/subjects/subjects.type"

import SubjectActions from "./SubjectActions"

export const columns: ColumnDef<ISubject>[] = [
  {
    accessorKey: "title",
    header: "Title",
  },
  {
    accessorKey: "slug",
    header: "Slug",
  },
  {
    accessorKey: "url",
    header: "URL",
    cell: ({ row }) => (
      <span className="font-mono text-sm">{row.original.url}</span>
    ),
  },
//   {
//     accessorKey: "createdAt",
//     header: "Created",
//     cell: ({ row }) => new Date(row.original.createdAt).toLocaleDateString(),
//   },
  {
    id: "actions",
    header: "",
    cell: ({ row }) => <SubjectActions subject={row.original} />,
  },
]
