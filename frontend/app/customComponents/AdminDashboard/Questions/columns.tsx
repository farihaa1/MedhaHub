"use client"

import { ColumnDef } from "@tanstack/react-table"

import { Badge } from "@/components/ui/badge"

import { Button } from "@/components/ui/button"

import Image from "next/image"

import { Pencil, Trash2 } from "lucide-react"
import { IEntityValue, IQuestion } from "@/app/redux/api/questionsApi"
const getEntityTitle = (entity: IEntityValue) => {
  if (!entity) return "-";

  if (typeof entity === "string") {
    return entity;
  }

  return entity.title;
};
export const columns: ColumnDef<IQuestion>[] = [
  {
    accessorKey: "_id",
    header: "#",
    cell: ({ row }) => (
      <div className="font-mono text-xs">{row.original._id.slice(-6)}</div>
    ),
  },

  {
    accessorKey: "questionImage",

    header: "Image",

    cell: ({ row }) =>
      row.original.questionImage ? (
        <Image
          src={row.original.questionImage}
          alt=""
          width={60}
          height={60}
          className="rounded border object-cover"
        />
      ) : (
        "-"
      ),
  },

  {
    accessorKey: "questionText",

    header: "Question",

    cell: ({ row }) => (
      <div className="max-w-md">{row.original.questionText}</div>
    ),
  },

  {
    accessorKey: "subjectId",
    header: "Subject",
    cell: ({ row }) => getEntityTitle(row.original.subjectId),
  },
  {
    accessorKey: "chapterId",
    header: "Chapter",
    cell: ({ row }) => getEntityTitle(row.original.chapterId),
  },
  {
    accessorKey: "topicId",
    header: "Topic",
    cell: ({ row }) => getEntityTitle(row.original.topicId),
  },

  {
    accessorKey: "difficulty",

    header: "Difficulty",

    cell: ({ row }) => (
      <Badge variant="outline">{row.original.difficulty}</Badge>
    ),
  },

  {
    accessorKey: "status",

    header: "Status",

    cell: ({ row }) => <Badge variant="secondary">{row.original.status}</Badge>,
  },

  {
    accessorKey: "sources",

    header: "Source",

    cell: ({ row }) => row.original.sources?.[0]?.name ?? "-",
  },

  {
    accessorKey: "createdAt",

    header: "Created",

    cell: ({ row }) => new Date(row.original.createdAt).toLocaleDateString(),
  },

  {
    id: "actions",

    header: "Action",

    cell: () => (
      <div className="flex gap-2">
        <Button variant="outline" size="icon">
          <Pencil className="h-4 w-4" />
        </Button>

        <Button variant="destructive" size="icon">
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    ),
  },
]
