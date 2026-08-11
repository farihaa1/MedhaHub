"use client"

import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface PaginationBarProps {
  currentPage: number
  totalPage: number
  onPageChange: (page: number) => void
  disabled?: boolean
}

export default function PaginationBar({
  currentPage,
  totalPage,
  onPageChange,
  disabled = false,
}: PaginationBarProps) {
  // Safety
  const safeCurrentPage = Math.max(1, Math.min(currentPage, totalPage || 1))

  const handlePrevious = () => {
    if (safeCurrentPage > 1 && !disabled) {
      onPageChange(safeCurrentPage - 1)
    }
  }

  const handleNext = () => {
    if (safeCurrentPage < totalPage && !disabled) {
      onPageChange(safeCurrentPage + 1)
    }
  }

  // Don't show pagination if there is only one page
  if (totalPage <= 1) {
    return null
  }

  return (
    <div className="flex flex-col items-center justify-between gap-4 border-t border-border/60 px-4 py-4 sm:flex-row">
      {/* Page information */}
      <div className="text-sm text-muted-foreground">
        Page{" "}
        <span className="font-medium text-foreground">{safeCurrentPage}</span>{" "}
        of <span className="font-medium text-foreground">{totalPage}</span>
      </div>

      {/* Pagination controls */}
      <div className="flex items-center gap-2">
        {/* Previous */}
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-9 gap-1"
          disabled={disabled || safeCurrentPage <= 1}
          onClick={handlePrevious}
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </Button>

        {/* Page numbers */}
        <div className="flex items-center gap-1">
          {Array.from({ length: totalPage }, (_, index) => index + 1).map(
            (page) => (
              <Button
                type="button"
                key={page}
                variant={page === safeCurrentPage ? "default" : "outline"}
                size="sm"
                className="h-9 w-9"
                disabled={disabled}
                onClick={() => onPageChange(page)}
              >
                {page}
              </Button>
            )
          )}
        </div>

        {/* Next */}
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-9 gap-1"
          disabled={disabled || safeCurrentPage >= totalPage}
          onClick={handleNext}
        >
          Next
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
