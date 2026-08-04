"use client"

import Link from "next/link"
import { FileText, Eye } from "lucide-react"

import { useGetPdfImportsQuery } from "@/app/redux/api/pdfImportApi"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function PdfImportsTable() {
  const { data, isLoading, error } = useGetPdfImportsQuery()

  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-10 text-center">
          Loading uploaded PDFs...
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardContent className="py-10 text-center text-red-500">
          Failed to load PDFs.
        </CardContent>
      </Card>
    )
  }

  const pdfs = data?.data ?? []

  if (pdfs.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <FileText className="mx-auto mb-4 h-14 w-14 text-muted-foreground" />

          <h2 className="text-xl font-semibold">No PDFs Uploaded</h2>

          <p className="mt-2 text-sm text-muted-foreground">
            Upload your first question bank PDF.
          </p>

          <Button className="mt-6" asChild>
            <Link href="/admin/pdf-import/upload">Upload PDF</Link>
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-5">
      {pdfs.map((item) => (
        <Card key={item.id}>
          <CardContent className="flex flex-col gap-5 p-6 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              <FileText className="h-10 w-10 text-red-500" />

              <div>
                <h2 className="font-semibold">{item.pdf.originalName}</h2>

                <p className="text-sm text-muted-foreground">
                  {item.pdf.totalPages} Pages
                </p>

                <p className="text-sm text-muted-foreground">
                  {(item.pdf.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>

            <Button asChild>
              <Link href={`/admin/pdf-import/${item.id}`}>
                <Eye className="mr-2 h-4 w-4" />
                Preview
              </Link>
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
