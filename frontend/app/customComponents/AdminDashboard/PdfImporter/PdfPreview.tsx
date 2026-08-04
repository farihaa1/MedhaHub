"use client"

import { PdfImport } from "@/app/redux/types/pdfImport.types"

import PdfInfoCard from "./PdfInfoCard"
import PdfPageCard from "./PdfPageCard"

interface Props {
  pdf: PdfImport
}

export default function PdfPreview({ pdf }: Props) {
    console.log(pdf)
  return (
    <div className="space-y-10">
      <PdfInfoCard pdf={pdf} />

      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">PDF Preview</h2>

        <span className="text-muted-foreground">
          {pdf.previews.length} Pages
        </span>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {pdf.previews.map((preview) => (
          <PdfPageCard
            key={preview.page}
            page={preview.page}
            image={preview.imagePath}
          />
        ))}
      </div>
    </div>
  )
}
