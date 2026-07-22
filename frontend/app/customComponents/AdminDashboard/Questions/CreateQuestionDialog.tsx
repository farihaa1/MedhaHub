"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import { ReactNode } from "react"

import QuestionForm from "./QuestionForm"

interface Props {
  children: ReactNode
}

export default function CreateQuestionDialog({ children }: Props) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent className="max-w-6xl">
        <DialogHeader>
          <DialogTitle>Create Question</DialogTitle>
        </DialogHeader>

        <QuestionForm />
      </DialogContent>
    </Dialog>
  )
}
