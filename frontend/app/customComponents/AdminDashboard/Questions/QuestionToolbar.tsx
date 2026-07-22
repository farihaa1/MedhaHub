"use client"

import { useState } from "react"

import {
  Plus,
  Upload,
  Download,
  RefreshCw,
  FileSpreadsheet,
} from "lucide-react"

import { Button } from "@/components/ui/button"

import CreateQuestionDialog from "./CreateQuestionDialog"
import BulkUploadDialog from "./BulkUploadDialog"
import ImportQuestionsDialog from "./ImportQuestionsDialog"
import ExportQuestionsDialog from "./ExportQuestionsDialog"
import BulkActionsDropdown from "./BulkActionsDropdown"

export default function QuestionToolbar() {
  const [refreshKey, setRefreshKey] = useState(0)

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          <CreateQuestionDialog>
            <Button>
              <Plus className="mr-2 size-4" />
              Create Question
            </Button>
          </CreateQuestionDialog>

          <BulkUploadDialog>
            <Button variant="outline">
              <Upload className="mr-2 size-4" />
              Bulk Upload
            </Button>
          </BulkUploadDialog>

          <ImportQuestionsDialog>
            <Button variant="outline">
              <FileSpreadsheet className="mr-2 size-4" />
              Import
            </Button>
          </ImportQuestionsDialog>

          <ExportQuestionsDialog>
            <Button variant="outline">
              <Download className="mr-2 size-4" />
              Export
            </Button>
          </ExportQuestionsDialog>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setRefreshKey((prev) => prev + 1)}
          >
            <RefreshCw className="mr-2 size-4" />
            Refresh
          </Button>

          <BulkActionsDropdown />
        </div>
      </div>
    </>
  )
}
