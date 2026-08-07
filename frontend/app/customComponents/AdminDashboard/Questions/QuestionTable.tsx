"use client"

import { DataTable } from "./data-table"
import { columns, IQuestionRow } from "./QuestionColumns"

import {
  IQuestion,
  QuestionDifficulty,
  QuestionMeta,
} from "@/app/redux/api/questionsApi"

interface QuestionTableProps {
  data: IQuestion[]
  loading: boolean
  isFetching: boolean

  pagination?: QuestionMeta

  page: number
  limit: number

  onPageChange: (page: number) => void
  onLimitChange: (limit: number) => void

  // NEW
  selectedQuestion?: IQuestion | null
  onSelectQuestion?: (question: IQuestion) => void
}

export default function QuestionTable({
  data,
  loading,
  isFetching,

  pagination,

  page,
  limit,

  onPageChange,
  onLimitChange,

  selectedQuestion,
  onSelectQuestion,
}: QuestionTableProps) {
  const tableData: IQuestionRow[] = (data ?? []).map((item) => ({
    _id: item._id,

    original: item,

    question: item.questionText,

    subject:
      item.subjectId && typeof item.subjectId !== "string"
        ? {
            _id: item.subjectId._id,
            name: item.subjectId.title,
          }
        : undefined,

    chapter:
      item.chapterId && typeof item.chapterId !== "string"
        ? {
            _id: item.chapterId._id,
            name: item.chapterId.title,
          }
        : undefined,

    topic:
      item.topicId && typeof item.topicId !== "string"
        ? {
            _id: item.topicId._id,
            name: item.topicId.title,
          }
        : undefined,

    difficulty: item.difficulty ?? QuestionDifficulty.EASY,

    status: item.status,

    source: item.sources ?? [],

    createdAt: item.createdAt,
  }))

  return (
    <DataTable
      columns={columns}
      data={tableData}

      isLoading={loading}
      isFetching={isFetching}

      pagination={pagination}

      page={page}
      limit={limit}

      onPageChange={onPageChange}
      onLimitChange={onLimitChange}

      // NEW
      selectedRowId={selectedQuestion?._id}
      onRowClick={(row) => onSelectQuestion?.(row.original)}
    />
  )
}
