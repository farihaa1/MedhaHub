"use client"

import { ReactNode, useState } from "react"

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
import { AcademicChapter } from "./AcademicTree"

interface Props {
  children: ReactNode
  chapter?: AcademicChapter
}

export default function CreateTopicDialog({ children,chapter }: Props) {


  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children ?? (
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Topic
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="min-w-3xl">
        <DialogHeader>
          <DialogTitle>Create New Topic</DialogTitle>
        </DialogHeader>

        <TopicForm
          mode="create"
          chapter={chapter}
          onSuccess={() => {
            setOpen(false)
          }}
        />
      </DialogContent>
    </Dialog>
  )
}
