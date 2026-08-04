"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { UploadCloud, FileText, Loader2 } from "lucide-react"

import { useUploadPdfMutation } from "@/app/redux/api/pdfImportApi"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function PdfUploadForm() {
  const router = useRouter()

  const [file, setFile] = useState<File | null>(null)

  const [uploadPdf, { isLoading }] = useUploadPdfMutation()

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a PDF file.")
      return
    }

    try {
      const res = await uploadPdf({
        file,
      }).unwrap()
      console.log(res)
      router.push(`/admin/pdf-import/${res.data.id}`)
    } catch (error) {
      console.error(error)
      alert("Upload failed.")
    }
  }

  return (
    <div className="mx-auto max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Upload Question Bank PDF</CardTitle>
        </CardHeader>

        <CardContent className="space-y-8">
          <div className="rounded-xl border-2 border-dashed p-10">
            <div className="flex flex-col items-center gap-4 text-center">
              <UploadCloud className="h-14 w-14 text-muted-foreground" />

              <div>
                <h3 className="text-lg font-semibold">Select a PDF file</h3>

                <p className="text-sm text-muted-foreground">
                  Upload a question bank PDF to generate preview images.
                </p>
              </div>

              <div className="w-full max-w-sm">
                <Label htmlFor="pdf">PDF File</Label>

                <Input
                  id="pdf"
                  type="file"
                  accept="application/pdf"
                  onChange={(e) => {
                    const selected = e.target.files?.[0]

                    if (!selected) return

                    if (selected.type !== "application/pdf") {
                      alert("Only PDF files are allowed.")
                      return
                    }

                    setFile(selected)
                  }}
                />
              </div>
            </div>
          </div>

          {file && (
            <Card>
              <CardContent className="flex items-center gap-4 py-6">
                <FileText className="h-10 w-10 text-red-500" />

                <div className="flex-1">
                  <h3 className="font-semibold">{file.name}</h3>

                  <p className="text-sm text-muted-foreground">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>

                  <p className="text-xs text-muted-foreground">{file.type}</p>
                </div>
              </CardContent>
            </Card>
          )}

          <Button
            className="w-full"
            disabled={!file || isLoading}
            onClick={handleUpload}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading PDF...
              </>
            ) : (
              <>
                <UploadCloud className="mr-2 h-4 w-4" />
                Upload PDF
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
