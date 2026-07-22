"use client"

import { useState } from "react"

import { Plus } from "lucide-react"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import { Button } from "@/components/ui/button"

import TopicForm from "./TopicForm"

interface Props {
  children?: React.ReactNode
}

export default function CreateTopicDialog({ children }: Props) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog
      open={open}

      onOpenChange={setOpen}
    >
      <DialogTrigger asChild>
        {children ?? (
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Topic
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Create New Topic</DialogTitle>
        </DialogHeader>

        <TopicForm
          mode="create"

          onSuccess={() => {
            setOpen(false)
          }}
        />
      </DialogContent>
    </Dialog>
  )
}
