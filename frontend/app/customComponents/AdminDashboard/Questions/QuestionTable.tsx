"use client"

import { DataTable } from "../data-table/DataTable"

import { columns, IQuestionRow } from "./QuestionColumns"

import {
  IQuestion,
  QuestionDifficulty,
  QuestionQuery,
  QuestionSourceType,
  QuestionStatus,
  QuestionType,
  useGetQuestionsQuery,
} from "@/app/redux/api/questionsApi"

interface QuestionTableProps {
  search: string

  subjectId: string

  chapterId: string

  topicId: string

  difficulty: string

  type: string

  status: string

  source: string

  sort: string
}

export default function QuestionTable({
  search,

  subjectId,

  chapterId,

  topicId,

  difficulty,

  type,

  status,

  source,

  sort,
}: QuestionTableProps) {
  const params: QuestionQuery = {
    searchTerm: search || undefined,

    subjectId: subjectId === "all" ? undefined : subjectId,

    chapterId: chapterId === "all" ? undefined : chapterId,

    topicId: topicId === "all" ? undefined : topicId,

    difficulty:
      difficulty === "all" ? undefined : (difficulty as QuestionDifficulty),

    type: type === "all" ? undefined : (type as QuestionType),

    status: status === "all" ? undefined : (status as QuestionStatus),

    source: source === "all" ? undefined : (source as QuestionSourceType),

    sortBy: sort === "az" || sort === "za" ? "questionText" : "createdAt",

    sortOrder: sort === "oldest" || sort === "az" ? "asc" : "desc",
  }

  const { data, isLoading } = useGetQuestionsQuery(params)

  const tableData: IQuestionRow[] =
    data?.data.data?.map((item: IQuestion) => ({
      _id: item._id,

      question: item.questionText,

      subject:
        item.subjectId && typeof item.subjectId !== "string"
          ? {
              _id: item.subjectId._id,
              name: item.subjectId.title ?? "-",
            }
          : undefined,

      chapter:
        item.chapterId && typeof item.chapterId !== "string"
          ? {
              _id: item.chapterId._id,
              name: item.chapterId.title ?? "-",
            }
          : undefined,

      topic:
        item.topicId && typeof item.topicId !== "string"
          ? {
              _id: item.topicId._id,
              name: item.topicId.title ?? "-",
            }
          : undefined,

      type: item.type,

      difficulty: item.difficulty ?? "",

      status: item.status,

      // FIX HERE
      source: item.sources ?? [],

      marks: item.marks ?? 1,

      createdAt: item.createdAt ?? "",
    })) ?? []

  return (
    <DataTable
      columns={columns}

      data={tableData}

      isLoading={isLoading}
    />
  )
}
