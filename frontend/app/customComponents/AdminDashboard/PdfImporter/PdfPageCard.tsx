"use client"

import { useState } from "react"
import Image from "next/image"
import { Maximize2 } from "lucide-react"

import { Dialog, DialogContent } from "@/components/ui/dialog"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface Props {
  page: number
  image: string
}

export default function PdfPageCard({ page, image }: Props) {
  const [open, setOpen] = useState(false)

  const imageUrl = `${process.env.NEXT_PUBLIC_API_URL}${image}`

  return (
    <>
      <Card className="overflow-hidden">
        <CardContent className="space-y-3 p-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Page {page}</h3>

            <Button size="icon" variant="outline" onClick={() => setOpen(true)}>
              <Maximize2 className="h-4 w-4" />
            </Button>
          </div>

          <div
            className="relative aspect-[1/1.414] cursor-pointer rounded-lg border bg-muted"
            onClick={() => setOpen(true)}
          >
            <Image
              src={imageUrl}
              alt={`Page ${page}`}
              fill
              className="object-contain"
            />
          </div>
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-6xl">
          <div className="space-y-4">
            <h2 className="text-center text-xl font-bold">Page {page}</h2>

            <div className="relative h-[80vh] w-full">
              <Image
                src={imageUrl}
                alt={`Page ${page}`}
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
