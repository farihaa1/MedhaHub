"use client"

import { useState } from "react"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import { Button } from "@/components/ui/button"

import { Plus } from "lucide-react"

import ChapterForm from "./ChapterForm"

interface Props {
  children?: React.ReactNode
}

export default function CreateChapterDialog({ children }: Props) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children ?? (
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Chapter
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Create New Chapter</DialogTitle>
        </DialogHeader>

        <ChapterForm
          mode="create"

          onSuccess={() => {
            setOpen(false)
          }}
        />
      </DialogContent>
    </Dialog>
  )
}
