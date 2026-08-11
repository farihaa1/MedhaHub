"use client"

import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
} from "@tanstack/react-table"

import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { cn } from "@/lib/utils"

import type { QuestionMeta } from "@/app/redux/api/questionsApi"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]

  isLoading?: boolean
  isFetching?: boolean

  pagination?: QuestionMeta

  page: number
  limit: number

  onPageChange: (page: number) => void
  onLimitChange: (limit: number) => void

  selectedRowId?: string | null

  getRowId: (row: TData) => string

  onRowClick?: (row: TData) => void
}

export function DataTable<TData, TValue>({
  columns,
  data,

  isLoading = false,
  isFetching = false,

  pagination,

  page,
  limit,

  onPageChange,
  onLimitChange,

  selectedRowId,

  getRowId,

  onRowClick,
}: DataTableProps<TData, TValue>) {
  // ============================================================
  // TABLE
  // ============================================================

  const table = useReactTable({
    data,
    columns,

    getCoreRowModel: getCoreRowModel(),

    getRowId: (row) => getRowId(row),
  })

  // ============================================================
  // PAGINATION DATA
  // ============================================================

  const total = pagination?.total ?? 0

  const totalPages =
    pagination?.totalPage ?? Math.max(1, Math.ceil(total / limit))

  const currentPage = Math.min(Math.max(page, 1), Math.max(totalPages, 1))

  const hasPreviousPage = currentPage > 1

  const hasNextPage = currentPage < totalPages

  // ============================================================
  // LOADING
  // ============================================================

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  // ============================================================
  // TABLE
  // ============================================================

  return (
    <div className="w-full">
      {/* ========================================================
          TABLE
      ======================================================== */}

      <div className="relative w-full overflow-auto">
        {isFetching && (
          <div className="absolute inset-x-0 top-0 z-10 h-1 overflow-hidden bg-muted">
            <div className="h-full w-1/3 animate-pulse bg-primary" />
          </div>
        )}

        <Table>
          {/* ====================================================
              HEADER
          ==================================================== */}

          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          {/* ====================================================
              BODY
          ==================================================== */}

          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => {
                const rowId = getRowId(row.original)

                const isSelected = selectedRowId === rowId

                return (
                  <TableRow
                    key={row.id}
                    data-state={isSelected ? "selected" : undefined}
                    className={cn(
                      "cursor-pointer",
                      isSelected && "bg-muted/60"
                    )}
                    onClick={() => onRowClick?.(row.original)}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                )
              })
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-32 text-center text-muted-foreground"
                >
                  No questions found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* ========================================================
          PAGINATION
      ======================================================== */}

      <div className="flex flex-col gap-4 border-t px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
        {/* ======================================================
            RESULT INFO
        ====================================================== */}

        <div className="text-sm text-muted-foreground">
          {total > 0 ? (
            <>
              Showing{" "}
              <span className="font-medium text-foreground">
                {(currentPage - 1) * limit + 1}
              </span>{" "}
              to{" "}
              <span className="font-medium text-foreground">
                {Math.min(currentPage * limit, total)}
              </span>{" "}
              of <span className="font-medium text-foreground">{total}</span>{" "}
              questions
            </>
          ) : (
            "No questions"
          )}
        </div>

        {/* ======================================================
            CONTROLS
        ====================================================== */}

        <div className="flex items-center gap-2">
          {/* PAGE SIZE */}

          <Select
            value={String(limit)}
            onValueChange={(value) => {
              onLimitChange(Number(value))
            }}
          >
            <SelectTrigger className="w-[110px]">
              <SelectValue />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="10">10 / page</SelectItem>

              <SelectItem value="20">20 / page</SelectItem>

              <SelectItem value="50">50 / page</SelectItem>

              <SelectItem value="100">100 / page</SelectItem>
            </SelectContent>
          </Select>

          {/* PAGE NUMBER */}

          <div className="min-w-[80px] text-center text-sm">
            Page <span className="font-medium">{currentPage}</span> of{" "}
            <span className="font-medium">{totalPages}</span>
          </div>

          {/* PREVIOUS */}

          <Button
            variant="outline"
            size="icon"
            disabled={!hasPreviousPage || isFetching}
            onClick={() => {
              if (!hasPreviousPage) {
                return
              }

              onPageChange(currentPage - 1)
            }}
            aria-label="Previous page"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          {/* NEXT */}

          <Button
            variant="outline"
            size="icon"
            disabled={!hasNextPage || isFetching}
            onClick={() => {
              if (!hasNextPage) {
                return
              }

              onPageChange(currentPage + 1)
            }}
            aria-label="Next page"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
