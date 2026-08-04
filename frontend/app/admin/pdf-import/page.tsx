"use client"

import Link from "next/link"
import { FileText, Upload } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useGetPdfImportsQuery } from "@/app/redux/api/pdfImportApi"

export default function PdfImportPage() {
  const { data, isLoading } = useGetPdfImportsQuery()

  const imports = data?.data ?? []

  if (isLoading) {
    return <div className="p-8">Loading...</div>
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">PDF Import</h1>

          <p className="text-muted-foreground">Upload PDFs and preview pages</p>
        </div>

        <Button asChild>
          <Link href="/admin/pdf-import/upload">
            <Upload className="mr-2 h-4 w-4" />
            Upload PDF
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Uploaded PDFs</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {imports.length === 0 && <p>No PDF uploaded yet.</p>}

          {imports.map((pdf) => (
            <div
              key={pdf.id}
              className="flex items-center justify-between rounded-lg border p-4"
            >
              <div>
                <p className="font-medium">{pdf.pdf.originalName}</p>

                <p className="text-sm text-muted-foreground">
                  {pdf.pdf.totalPages} pages
                </p>
              </div>

              <Button variant="outline" size="sm" asChild>
                <Link href={`/admin/pdf-import/${pdf.id}`}>
                  <FileText className="mr-2 h-4 w-4" />
                  Preview
                </Link>
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
