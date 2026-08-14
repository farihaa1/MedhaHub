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

interface EditTopicDialogProps {
  topic: ITopic
  children?: React.ReactNode
}

export default function EditTopicDialog({
  topic,
  children,
}: EditTopicDialogProps) {
  const [open, setOpen] = useState(false)

  const handleSuccess = () => {
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children ?? (
          <Button type="button" variant="ghost" size="sm">
            <Pencil className="mr-2 h-4 w-4" />
            বিষয় সম্পাদনা
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>বিষয় সম্পাদনা করুন</DialogTitle>

          <DialogDescription>
            বিষয়টির তথ্য পরিবর্তন করুন। পরিবর্তনগুলো একাডেমিক কাঠামোর সর্বত্র
            স্বয়ংক্রিয়ভাবে আপডেট হবে।
          </DialogDescription>
        </DialogHeader>

        <TopicForm mode="edit" topic={topic} onSuccess={handleSuccess} />
      </DialogContent>
    </Dialog>
  )
}
