"use client"

import { useEffect, useState } from "react"

import { AlertTriangle, GitMerge } from "lucide-react"

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

import {
  ITopic,
  useGetTopicsQuery,
  useMergeTopicMutation,
} from "@/app/redux/api/topicsApi"

interface Props {
  topic: ITopic
  children?: React.ReactNode
}

export default function MergeTopicDialog({ topic, children }: Props) {
  const [open, setOpen] = useState(false)

  const [targetTopicId, setTargetTopicId] = useState("")

  const { data: topicsData, isLoading: loadingTopics } = useGetTopicsQuery()

  const [mergeTopic, { isLoading }] = useMergeTopicMutation()

  async function handleMerge() {
    if (!targetTopicId) return

    try {
      await mergeTopic({
        sourceTopicId: topic._id,
        targetTopicId,
      }).unwrap()

      toast.success("Topics merged successfully.")

      setOpen(false)
    } catch (error) {
      console.error(error)

      toast.error("Failed to merge topics.")
    }
  }

  const handleOpenChange = (value: boolean) => {
    setOpen(value)

    if (!value) {
      setTargetTopicId("")
    }
  }

  const availableTopics =
    topicsData?.data.filter((item) => item._id !== topic._id) ?? []

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {children ?? (
          <Button variant="ghost" size="sm">
            <GitMerge className="mr-2 h-4 w-4" />
            Merge Topic
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <GitMerge className="h-5 w-5" />
            Merge Topic
          </DialogTitle>

          <DialogDescription>
            Merge this topic into another existing topic. All questions,
            statistics and references will be transferred.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5">
          <div className="rounded-lg border border-yellow-500/30 bg-yellow-500/10 p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="mt-0.5 h-5 w-5 text-yellow-600" />

              <div className="text-sm">
                <p className="font-medium">You are merging</p>

                <p className="mt-1">
                  <strong>{topic.title}</strong> into another topic.
                </p>

                <p className="mt-2 text-muted-foreground">
                  After merging, this topic will no longer be available. All
                  questions will belong to the selected destination topic.
                </p>
              </div>
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Destination Topic
            </label>

            <Select value={targetTopicId} onValueChange={setTargetTopicId}>
              <SelectTrigger>
                <SelectValue placeholder="Select destination topic" />
              </SelectTrigger>

              <SelectContent>
                {loadingTopics ? (
                  <SelectItem value="loading" disabled>
                    Loading topics...
                  </SelectItem>
                ) : availableTopics.length ? (
                  availableTopics.map((item) => (
                    <SelectItem key={item._id} value={item._id}>
                      {item.title}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="empty" disabled>
                    No available topics
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>

          <Button onClick={handleMerge} disabled={!targetTopicId || isLoading}>
            {isLoading ? "Merging..." : "Merge Topics"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
