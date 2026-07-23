"use client"

import { Download, RefreshCw, Upload } from "lucide-react"

import { Button } from "@/components/ui/button"

interface QuestionToolbarProps {
  onRefresh: () => void
  onExport: () => void
  onImport?: () => void
}

export default function QuestionToolbar({
  onRefresh,
  onExport,
  onImport,
}: QuestionToolbarProps) {
  return (
    <div className="flex flex-col gap-3 rounded-xl border bg-card p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h2 className="text-lg font-semibold">Question Tools</h2>

        <p className="text-sm text-muted-foreground">
          Manage, import and export question data.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Button variant="outline" onClick={onRefresh}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh
        </Button>

        <Button variant="outline" onClick={onExport}>
          <Download className="mr-2 h-4 w-4" />
          Export
        </Button>

        <Button onClick={onImport}>
          <Upload className="mr-2 h-4 w-4" />
          Import
        </Button>
      </div>
    </div>
  )
}
