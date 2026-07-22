"use client"

import { useState } from "react"

import { Pencil } from "lucide-react"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import { Button } from "@/components/ui/button"

import TopicForm from "./TopicForm"

import { ITopic } from "@/app/redux/api/topicsApi"

interface Props {
  topic: ITopic
  children?: React.ReactNode
}

export default function EditTopicDialog({ topic, children }: Props) {
  const [open, setOpen] = useState(false)

  function handleSuccess() {
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children ?? (
          <Button variant="ghost" size="sm">
            <Pencil className="mr-2 h-4 w-4" />
            Edit Topic
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit Topic</DialogTitle>

          <DialogDescription>
            Update the topic information. Changes will be reflected immediately
            throughout the academic hierarchy.
          </DialogDescription>
        </DialogHeader>

        <TopicForm mode="edit" topic={topic} onSuccess={handleSuccess} />
      </DialogContent>
    </Dialog>
  )
}
