"use client"

import { useState } from "react"

import { Upload, FileSpreadsheet, AlertCircle } from "lucide-react"

import { Button } from "@/components/ui/button"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog"

import { Input } from "@/components/ui/input"

// import { Alert, AlertDescription } from "@/components/ui/alert"

// import { useBulkImportAcademicMutation } from "@/app/redux/api/academicApi"

interface Props {
  children?: React.ReactNode
}

export default function BulkImportDialog({ children }: Props) {
  const [open, setOpen] = useState(false)

  const [file, setFile] = useState<File | null>(null)

  // const [importAcademic, { isLoading }] = useBulkImportAcademicMutation()

  // async function handleImport() {
  //   if (!file) return

  //   const formData = new FormData()

  //   formData.append("file", file)

  //   try {
  //     await importAcademic(formData).unwrap()

  //     setOpen(false)

  //     setFile(null)
  //   } catch (error) {
  //     console.log(error)
  //   }
  // }

  return (
    <Dialog
      open={open}

      onOpenChange={setOpen}
    >
      {/* <DialogTrigger asChild>
        {children ?? (
          <Button variant="outline">
            <Upload className="mr-2 h-4 w-4" />
            Import
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Bulk Import Chapters & Topics</DialogTitle>
        </DialogHeader>

        <div className="space-y-5">
          <Alert>
            <FileSpreadsheet className="h-4 w-4" />

            <AlertDescription>Supported formats: CSV, XLSX</AlertDescription>
          </Alert>

          <div className="rounded-lg border border-dashed p-6 text-center">
            <Input
              type="file"

              accept="
.csv,
.xlsx
"

              onChange={(e) => {
                const selected = e.target.files?.[0]

                if (selected) setFile(selected)
              }}
            />

            {file && (
              <p className="mt-3 text-sm">
                Selected:
                <strong className="ml-1">{file.name}</strong>
              </p>
            )}
          </div>

          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />

            <AlertDescription>
              Make sure Subject, Chapter and Topic names are correct before
              importing.
            </AlertDescription>
          </Alert>
        </div>

        <DialogFooter>
          <Button
            variant="outline"

            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>

          <Button
            disabled={!file || isLoading}

            onClick={handleImport}
          >
            {isLoading ? "Importing..." : "Import Data"}
          </Button>
        </DialogFooter>
      </DialogContent> */}
    </Dialog>
  )
}
