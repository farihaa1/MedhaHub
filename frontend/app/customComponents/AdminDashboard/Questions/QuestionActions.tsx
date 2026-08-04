"use client"

import { useState } from "react"

import { Eye, Pencil, BookOpen, Trash2, MoreHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import PreviewQuestionDialog from "./PreviewQuestionDialog"
import EditQuestionDialog from "./EditQuestionDialog"
import DeleteQuestionDialog from "./DeleteQuestionDialog"
import AddToQuestionBankDialog from "./AddToQuestionBankDialog"

import { IQuestion } from "@/app/redux/api/questionsApi"

interface QuestionActionsProps {
  question: IQuestion
}

export default function QuestionActions({ question }: QuestionActionsProps) {
  const [previewOpen, setPreviewOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [questionBankOpen, setQuestionBankOpen] = useState(false)

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setPreviewOpen(true)}>
            <Eye className="mr-2 h-4 w-4" />
            Preview
          </DropdownMenuItem>

          <DropdownMenuItem onClick={() => setEditOpen(true)}>
            <Pencil className="mr-2 h-4 w-4" />
            Edit
          </DropdownMenuItem>

          <DropdownMenuItem onClick={() => setQuestionBankOpen(true)}>
            <BookOpen className="mr-2 h-4 w-4" />
            Add To Question Bank
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => setDeleteOpen(true)}
            className="text-red-600 focus:text-red-600"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <PreviewQuestionDialog
        questionId={question._id}
        open={previewOpen}
        onOpenChange={setPreviewOpen}
      />

      <EditQuestionDialog
        questionId={question._id}
        open={editOpen}
        onOpenChange={setEditOpen}
      />

      <AddToQuestionBankDialog
        questionId={question._id}
        open={questionBankOpen}
        onOpenChange={setQuestionBankOpen}
      />

      <DeleteQuestionDialog
        question={question}
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
      />
    </>
  )
}
