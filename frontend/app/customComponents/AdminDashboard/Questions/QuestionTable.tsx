"use client"

import { useMemo } from "react"

import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { useAppSelector } from "@/app/redux/hooks"

import { useGetQuestionsQuery } from "@/app/redux/api/questionsApi"

import { columns } from "./QuestionColumns"

import QuestionPagination from "./QuestionPagination"
import QuestionTableSkeleton from "./QuestionTableSkeleton"
import QuestionEmptyState from "./QuestionEmptyState"

export default function QuestionTable() {
  const filters = useAppSelector((state) => state.questionFilter)

  const { data, isLoading } = useGetQuestionsQuery(filters)

  const table = useReactTable({
    data: data?.data ?? [],

    columns,

    getCoreRowModel: getCoreRowModel(),
  })

  if (isLoading) {
    return <QuestionTableSkeleton />
  }

  if (!data?.data.length) {
    return <QuestionEmptyState />
  }

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((group) => (
              <TableRow key={group.id}>
                {group.headers.map((header) => (
                  <TableHead key={header.id}>
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <QuestionPagination meta={data.meta} />
    </div>
  )
}
