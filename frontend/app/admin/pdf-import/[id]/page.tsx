"use client"

import { useParams } from "next/navigation"

import { useGetPdfImportByIdQuery } from "@/app/redux/api/pdfImportApi"

import PdfPreview from "@/app/customComponents/AdminDashboard/PdfImporter/PdfPreview"

export default function PdfPreviewPage() {
  const params = useParams()

  const id = params.id as string

  const { data, isLoading, error } = useGetPdfImportByIdQuery(id)

  if (isLoading) {
    return <div className="p-8">Loading preview...</div>
  }

  if (error || !data) {
    return <div className="p-8">Failed to load PDF preview.</div>
  }

  return (
    <div className="p-8">
      <PdfPreview pdf={data.data} />
    </div>
  )
}
