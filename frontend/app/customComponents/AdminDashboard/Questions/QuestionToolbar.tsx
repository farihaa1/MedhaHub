"use client"

import { useEffect, useRef } from "react"

import { Search, Download, Upload, Plus, X } from "lucide-react"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface QuestionToolbarProps {
  search: string
  onSearchChange: (value: string) => void
  onCreate?: () => void
  onImport?: () => void
  onExport?: () => void
}

export default function QuestionToolbar({
  search,
  onSearchChange,
  onCreate,
  onImport,
  onExport,
}: QuestionToolbarProps) {
  const firstRender = useRef(true)

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false
      return
    }

    const timer = setTimeout(() => {
      onSearchChange(search)
    }, 500)

    return () => clearTimeout(timer)
  }, [search, onSearchChange])

  return (
    <div className="flex flex-col gap-4 bg-background p-4 lg:flex-row lg:items-center lg:justify-between lg:px-20">
      <div className="relative w-full lg:max-w-md">
        <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

        <Input
          value={search}
          placeholder="Search questions..."
          className="pr-10 pl-10"
          onChange={(e) => onSearchChange(e.target.value)}
        />

        {search && (
          <Button
            variant="ghost"
            size="icon"
            type="button"
            className="absolute top-1/2 right-1 h-8 w-8 -translate-y-1/2"
            onClick={() => onSearchChange("")}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Button variant="outline" onClick={onImport}>
          <Upload className="mr-2 h-4 w-4" />
          Import
        </Button>

        <Button variant="outline" onClick={onExport}>
          <Download className="mr-2 h-4 w-4" />
          Export
        </Button>

        <Button onClick={onCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Add Question
        </Button>
      </div>
    </div>
  )
}
