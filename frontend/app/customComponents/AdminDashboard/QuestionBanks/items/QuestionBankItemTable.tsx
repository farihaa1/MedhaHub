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

import {
  questionBankItemColumns,
} from "./QuestionBankItemColumns"
import { IQuestionBankItem } from "@/app/redux/types/questionBank.types"

interface Props {
  questionBankId: string
}

export default function QuestionBankItemTable({
  questionBankId,
}: Props) {
  const { data, isLoading, isError } =
    useGetQuestionsByBankQuery({
      questionBankId,
      page: 1,
      limit: 100,
    })

  const questions = data?.data?.data ?? []

 const table = useReactTable<IQuestionBankItem>({
  data: questions,
  columns: questionBankItemColumns,
  getCoreRowModel: getCoreRowModel(),
})
    
console.log(data)
  if (isLoading) {
    return (
      <div className="flex min-h-40 items-center justify-center text-sm text-muted-foreground">
        Loading questions...
      </div>
    )
  }

  if (isError) {
    return (
      <div className="flex min-h-40 items-center justify-center text-sm text-destructive">
        Failed to load questions.
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-lg border bg-background">
      {/* <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>

        <TableBody>
          {table.getRowModel().rows.length > 0 ? (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(
                      cell.column.columnDef.cell,
                      cell.getContext(),
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={questionBankItemColumns.length}
                className="h-32 text-center text-muted-foreground"
              >
                No questions found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table> */}
    </div>
  )
}