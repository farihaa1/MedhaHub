"use client"

import { useState } from "react"

import { Trash2, AlertTriangle } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog"
import { IChapter, useDeleteChapterMutation } from "@/app/redux/api/chaptersApi"
interface Props {
  chapter: IChapter
  children?: React.ReactNode
}

export default function DeleteChapterDialog({
  chapter,

  children,
}: Props) {
  const [open, setOpen] = useState(false)

  const [deleteChapter, { isLoading }] = useDeleteChapterMutation()

  async function handleDelete() {
    try {
      await deleteChapter(chapter._id).unwrap()

      setOpen(false)
    } catch (error) {
      console.log(error)
    }
  }

  const hasTopics = (chapter.totalTopics ?? 0) > 0

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

            className="text-destructive"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </Button>
        )}
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            Delete Chapter
          </DialogTitle>

          <DialogDescription>
            Are you sure you want to delete
            <span className="mx-1 font-semibold">{chapter.title}</span>
            chapter?
          </DialogDescription>
        </DialogHeader>

        {hasTopics && (
          <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm">
            This chapter contains
            <strong className="mx-1">{chapter.totalTopics}</strong>
            topics. Please move or delete topics before removing this chapter.
          </div>
        )}

        <DialogFooter>
          <Button
            variant="outline"

            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>

          <Button
            variant="destructive"

            disabled={hasTopics || isLoading}

            onClick={handleDelete}
          >
            {isLoading ? "Deleting..." : "Delete Chapter"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
