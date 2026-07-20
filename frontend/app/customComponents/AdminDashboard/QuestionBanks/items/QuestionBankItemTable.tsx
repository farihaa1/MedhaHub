"use client"

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
import { useGetQuestionsByBankQuery } from "@/app/redux/api/questionBankItemApi"
import { questionBankItemColumns } from "./QuestionBankItemColumns"

interface Props {
  questionBankId: string
}

export default function QuestionBankItemTable({ questionBankId }: Props) {
  console.log("QuestionBankId:", questionBankId)
  const { data, isLoading } = useGetQuestionsByBankQuery({
    questionBankId,
  })

  const table = useReactTable({
    data: data?.data ?? [],
    columns: questionBankItemColumns,
    getCoreRowModel: getCoreRowModel(),
  })

  if (isLoading) {
    return <p>Loading...</p>
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
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

          {!table.getRowModel().rows.length && (
            <TableRow>
              <TableCell colSpan={8} className="text-center">
                No questions found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
