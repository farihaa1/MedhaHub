"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

import { Badge } from "@/components/ui/badge"

import { IQuestionBank } from "@/app/redux/types/questionBank.types"

interface Props {
  open: boolean

  onOpenChange: (open: boolean) => void

  bank: IQuestionBank | null
}

export default function ViewQuestionBankDialog({
  open,
  onOpenChange,
  bank,
}: Props) {
  if (!bank) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Question Bank Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          <div>
            <strong>Title:</strong> {bank.title}
          </div>

          <div>
            <strong>Category:</strong> <Badge>{bank.category}</Badge>
          </div>

          <div>
            <strong>Paper:</strong> {bank.paper ?? "-"}
          </div>

          <div>
            <strong>Year:</strong> {bank.year ?? "-"}
          </div>

          <div>
            <strong>Organization:</strong> {bank.organization ?? "-"}
          </div>

          <div>
            <strong>Total Questions:</strong> {bank.totalQuestions}
          </div>

          <div>
            <strong>Status:</strong>{" "}
            <Badge>{bank.isPublished ? "Published" : "Draft"}</Badge>
          </div>

          <div>
            <strong>Premium:</strong>{" "}
            <Badge>{bank.isPremium ? "Premium" : "Free"}</Badge>
          </div>

          <p className="text-muted-foreground">{bank.description}</p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
