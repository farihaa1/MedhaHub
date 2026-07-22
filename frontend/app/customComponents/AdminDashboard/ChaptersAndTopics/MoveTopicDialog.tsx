"use client"

import { useEffect, useState } from "react"

import { ArrowRightLeft } from "lucide-react"

import { toast } from "sonner"

import { Button } from "@/components/ui/button"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { IChapter, useGetChaptersQuery } from "@/app/redux/api/chaptersApi"

import { ITopic, useMoveTopicMutation } from "@/app/redux/api/topicsApi"

interface Props {
  topic: ITopic
  children?: React.ReactNode
}

export default function MoveTopicDialog({ topic, children }: Props) {
  const [open, setOpen] = useState(false)

  const [selectedChapter, setSelectedChapter] = useState("")

  const { data: chaptersData, isLoading: loadingChapters } =
    useGetChaptersQuery()

  const [moveTopic, { isLoading }] = useMoveTopicMutation()

  const handleOpenChange = (value: boolean) => {
    setOpen(value)

    if (!value) {
      setSelectedChapter("")
    }
  }

  async function handleMove() {
    if (!selectedChapter) return

    try {
      await moveTopic({
        id: topic._id,
        chapterId: selectedChapter,
      }).unwrap()

      toast.success("Topic moved successfully.")

      setOpen(false)
    } catch (error) {
      console.error(error)

      toast.error("Failed to move topic.")
    }
  }

  const chapters =
    chaptersData?.data.filter(
      (chapter: IChapter) => chapter._id !== topic.chapterId
    ) ?? []

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {children ?? (
          <Button variant="ghost" size="sm">
            <ArrowRightLeft className="mr-2 h-4 w-4" />
            Move Topic
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Move Topic</DialogTitle>

          <DialogDescription>
            Move <strong>{topic.title}</strong> to another chapter. All
            questions associated with this topic will move together.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <Select value={selectedChapter} onValueChange={setSelectedChapter}>
            <SelectTrigger>
              <SelectValue placeholder="Select destination chapter" />
            </SelectTrigger>

            <SelectContent>
              {loadingChapters ? (
                <SelectItem value="loading" disabled>
                  Loading chapters...
                </SelectItem>
              ) : chapters.length ? (
                chapters.map((chapter) => (
                  <SelectItem key={chapter._id} value={chapter._id}>
                    {chapter.title}
                  </SelectItem>
                ))
              ) : (
                <SelectItem value="empty" disabled>
                  No chapters available
                </SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>

          <Button onClick={handleMove} disabled={!selectedChapter || isLoading}>
            {isLoading ? "Moving..." : "Move Topic"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
