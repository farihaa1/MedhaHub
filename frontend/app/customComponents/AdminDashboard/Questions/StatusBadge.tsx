"use client"

import { Badge } from "@/components/ui/badge"

import { QuestionStatus } from "@/app/redux/api/questionsApi"

interface Props {
  status: QuestionStatus
}

export default function StatusBadge({ status }: Props) {
  switch (status) {
    case QuestionStatus.APPROVED:
      return <Badge>Published</Badge>

    case QuestionStatus.PENDING:
      return <Badge variant="secondary">Pending</Badge>

    case QuestionStatus.REJECTED:
      return <Badge variant="destructive">Rejected</Badge>

    default:
      return null
  }
}
