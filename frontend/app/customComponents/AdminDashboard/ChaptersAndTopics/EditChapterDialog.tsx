"use client"

import { useState } from "react"
import { Pencil } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import ChapterForm from "./ChapterForm"
import { IChapter } from "@/app/redux/api/chaptersApi"

interface Props {
  chapter: IChapter
  children?: React.ReactNode
}

export default function EditChapterDialog({ chapter, children }: Props) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog
      open={open}

      onOpenChange={setOpen}
    >
      <DialogTrigger asChild>
        {children ?? (
          <Button
            variant="ghost"

            size="sm"
          >
            <Pencil className="mr-2 h-4 w-4" />
            Edit
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Edit Chapter</DialogTitle>
        </DialogHeader>

        <ChapterForm
          mode="edit"

          chapter={chapter}

          onSuccess={() => {
            setOpen(false)
          }}
        />
      </DialogContent>
    </Dialog>
  )
}
