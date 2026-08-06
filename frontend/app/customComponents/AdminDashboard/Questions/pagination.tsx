"use client"

import { Button } from "@/components/ui/button"

interface Props {
  currentPage: number
  totalPage: number
  onPageChange: (page: number) => void
}

export default function PaginationBar({
  currentPage,
  totalPage,
  onPageChange,
}: Props) {
  return (
    <div className="flex items-center justify-center gap-2">
      <Button
        variant="outline"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        Previous
      </Button>

      {Array.from({ length: totalPage }, (_, i) => (
        <Button
          key={i}
          variant={currentPage === i + 1 ? "default" : "outline"}
          onClick={() => onPageChange(i + 1)}
        >
          {i + 1}
        </Button>
      ))}

      <Button
        variant="outline"
        disabled={currentPage === totalPage}
        onClick={() => onPageChange(currentPage + 1)}
      >
        Next
      </Button>
    </div>
  )
}
