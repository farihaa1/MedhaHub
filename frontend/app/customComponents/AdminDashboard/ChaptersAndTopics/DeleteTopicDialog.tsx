"use client"

import { useState } from "react"

import { AlertTriangle, Trash2 } from "lucide-react"

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

import { Badge } from "@/components/ui/badge"

import { ITopic, useDeleteTopicMutation } from "@/app/redux/api/topicsApi"

interface Props {
  topic: ITopic
  children?: React.ReactNode
}

export default function DeleteTopicDialog({ topic, children }: Props) {
  const [open, setOpen] = useState(false)

  const [deleteTopic, { isLoading }] = useDeleteTopicMutation()

  const hasQuestions = (topic.totalQuestions ?? 0) > 0

  async function handleDelete() {
    try {
      await deleteTopic(topic._id).unwrap()

      setOpen(false)
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children ?? (
          <Button variant="ghost" size="sm" className="text-destructive">
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            Delete Topic
          </DialogTitle>

          <DialogDescription>This action cannot be undone.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="rounded-lg border bg-muted/40 p-4">
            <div className="space-y-3">
              <div>
                <p className="text-xs text-muted-foreground">Topic</p>

                <p className="font-semibold">{topic.title}</p>
              </div>

              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">
                  {topic.totalQuestions ?? 0} Questions
                </Badge>

                {"status" in topic && (
                  <Badge variant="outline">{String(topic.status)}</Badge>
                )}
              </div>
            </div>
          </div>

          {hasQuestions ? (
            <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm">
              <p className="font-medium text-destructive">
                This topic cannot be deleted.
              </p>

              <p className="mt-2 text-muted-foreground">
                It currently contains <strong>{topic.totalQuestions}</strong>{" "}
                questions.
              </p>

              <p className="mt-2 text-muted-foreground">
                Move or merge the questions into another topic before deleting
                this topic.
              </p>
            </div>
          ) : (
            <div className="rounded-lg border border-yellow-500/30 bg-yellow-500/10 p-4 text-sm">
              Deleting this topic will permanently remove it from the academic
              hierarchy.
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>

          <Button
            variant="destructive"
            disabled={hasQuestions || isLoading}
            onClick={handleDelete}
          >
            {isLoading ? "Deleting..." : "Delete Topic"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
