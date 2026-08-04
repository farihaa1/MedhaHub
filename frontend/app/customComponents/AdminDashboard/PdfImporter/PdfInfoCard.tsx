"use client"

import { FileText, HardDrive, Layers, Folder } from "lucide-react"

import { PdfImport } from "@/app/redux/types/pdfImport.types"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface Props {
  pdf: PdfImport
}

export default function PdfInfoCard({ pdf }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>PDF Information</CardTitle>
      </CardHeader>

      <CardContent>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          <InfoItem
            icon={<FileText className="h-5 w-5" />}
            label="File Name"
            value={pdf.pdf.originalName}
          />

          <InfoItem
            icon={<Layers className="h-5 w-5" />}
            label="Total Pages"
            value={String(pdf.pdf.totalPages)}
          />

          <InfoItem
            icon={<HardDrive className="h-5 w-5" />}
            label="File Size"
            value={`${(pdf.pdf.size / 1024 / 1024).toFixed(2)} MB`}
          />

          <InfoItem
            icon={<Folder className="h-5 w-5" />}
            label="Stored File"
            value={pdf.pdf.filename}
          />
        </div>
      </CardContent>
    </Card>
  )
}

function InfoItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: string
}) {
  return (
    <div className="flex gap-4">
      <div className="rounded-lg border p-3">{icon}</div>

      <div>
        <p className="text-sm text-muted-foreground">{label}</p>

        <p className="font-semibold break-all">{value}</p>
      </div>
    </div>
  )
}
