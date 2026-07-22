"use client"

import { Plus, FolderPlus, Download, RefreshCw } from "lucide-react"

import { Button } from "@/components/ui/button"

import CreateChapterDialog from "./CreateChapterDialog"
import CreateTopicDialog from "./CreateTopicDialog"

interface Props {
  onRefresh?: () => void
  onExport?: () => void
}

export default function AcademicToolbar({ onRefresh, onExport }: Props) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border bg-card p-4">
      <div className="flex flex-wrap gap-2">
        <CreateChapterDialog>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Chapter
          </Button>
        </CreateChapterDialog>

        <CreateTopicDialog>
          <Button variant="secondary">
            <FolderPlus className="mr-2 h-4 w-4" />
            New Topic
          </Button>
        </CreateTopicDialog>
      </div>

      <div className="flex gap-2">
        <Button variant="outline" onClick={onExport}>
          <Download className="mr-2 h-4 w-4" />
          Export
        </Button>

        <Button variant="outline" onClick={onRefresh}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh
        </Button>
      </div>
    </div>
  )
}
