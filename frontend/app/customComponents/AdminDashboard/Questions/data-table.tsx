"use client"

import {
  ColumnDef,
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

import { Button } from "@/components/ui/button"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { Loader2 } from "lucide-react"

export interface PaginationMeta {
  page: number
  limit: number
  total: number
  totalPage: number
}

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]

  isLoading?: boolean
  isFetching?: boolean

  pagination?: PaginationMeta

  page?: number
  limit?: number

  onPageChange?: (page: number) => void
  onLimitChange?: (limit: number) => void

  /**
   * Row selection
   */
  selectedRowId?: string
  getRowId?: (row: TData) => string
  onRowClick?: (row: TData) => void
}

export function DataTable<TData, TValue>({
  columns,
  data,

  isLoading = false,
  isFetching = false,

  pagination,

  page = 1,
  limit = 20,

  onPageChange,
  onLimitChange,

  selectedRowId,
  getRowId,
  onRowClick,
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,

    getCoreRowModel: getCoreRowModel(),

    getRowId: getRowId ? (row) => getRowId(row) : undefined,
  })

  /*
   * Initial loading
   */
  if (isLoading) {
    return (
      <div className="flex min-h-105 items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-muted-foreground">
          <Loader2 className="h-6 w-6 animate-spin" />

          <p className="text-sm">Loading questions...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full">
      {/* Fetching indicator */}
      {isFetching && (
        <div className="flex items-center gap-2 border-b border-border/60 bg-muted/30 px-4 py-2 text-xs text-muted-foreground">
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
          Updating questions...
        </div>
      )}

      {/* Table */}
      <div className="w-full overflow-x-auto">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                className="border-b border-border/60 bg-muted/30 hover:bg-muted/30"
              >
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="h-11 px-4 text-xs font-semibold tracking-wide whitespace-nowrap text-muted-foreground uppercase"
                  >
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

          <TableBody>
            {table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row) => {
                const rowId = getRowId ? getRowId(row.original) : row.id

                const isSelected = selectedRowId === rowId

                return (
                  <TableRow
                    key={row.id}
                    onClick={() => onRowClick?.(row.original)}
                    className={`group border-b border-border/50 transition-colors ${
                      onRowClick ? "cursor-pointer" : ""
                    } ${
                      isSelected
                        ? "bg-primary/5 hover:bg-primary/10 dark:bg-primary/10 dark:hover:bg-primary/15"
                        : "hover:bg-muted/40"
                    } `}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        className="px-4 py-3 align-middle"
                      >
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
                  className="h-40 text-center"
                >
                  <div className="flex flex-col items-center justify-center gap-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                      <span className="text-lg">?</span>
                    </div>

                    <p className="text-sm font-medium">No questions found</p>

                    <p className="text-xs text-muted-foreground">
                      Try changing your filters or search.
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {pagination && pagination.total > 0 && (
        <div className="flex flex-col gap-4 border-t border-border/60 px-4 py-4 md:flex-row md:items-center md:justify-between">
          {/* Results */}
          <div className="text-sm text-muted-foreground">
            Showing{" "}
            <span className="font-medium text-foreground">
              {(pagination.page - 1) * pagination.limit + 1}
            </span>{" "}
            -{" "}
            <span className="font-medium text-foreground">
              {Math.min(pagination.page * pagination.limit, pagination.total)}
            </span>{" "}
            of{" "}
            <span className="font-medium text-foreground">
              {pagination.total}
            </span>
          </div>

          {/* Controls */}
          <div className="flex flex-wrap items-center gap-2">
            <Select
              value={String(limit)}
              onValueChange={(value) => {
                onLimitChange?.(Number(value))
                onPageChange?.(1)
              }}
            >
              <SelectTrigger className="h-9 w-20 bg-background">
                <SelectValue />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="10">20</SelectItem>

                <SelectItem value="50">50</SelectItem>

                <SelectItem value="100">100</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              size="sm"
              className="h-9"
              disabled={page <= 1 || isFetching}
              onClick={() => onPageChange?.(page - 1)}
            >
              Previous
            </Button>

            <div className="flex h-9 items-center rounded-md border border-border bg-muted/30 px-3 text-sm font-medium">
              {pagination.page}
              <span className="mx-1 text-muted-foreground">/</span>
              {pagination.totalPage}
            </div>

            <Button
              variant="outline"
              size="sm"
              className="h-9"
              disabled={page >= pagination.totalPage || isFetching}
              onClick={() => onPageChange?.(page + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
