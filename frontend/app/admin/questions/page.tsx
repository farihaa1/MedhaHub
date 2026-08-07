"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"

import PageHeader from "@/app/customComponents/shared/PageHeader"
import QuestionStats from "@/app/customComponents/AdminDashboard/Questions/QuestionStats"
import QuestionToolbar from "@/app/customComponents/AdminDashboard/Questions/QuestionToolbar"
import QuestionFilters from "@/app/customComponents/AdminDashboard/Questions/QuestionFilters"
import QuestionTable from "@/app/customComponents/AdminDashboard/Questions/QuestionTable"
import QuestionDetailsPanel from "@/app/customComponents/AdminDashboard/Questions/QuestionDetailsPanel"

import {
  IQuestion,
  QuestionDifficulty,
  QuestionSourceType,
  QuestionStatus,
  QuestionType,
  useGetQuestionsQuery,
} from "@/app/redux/api/questionsApi"

export default function QuestionsPage() {
  const router = useRouter()

  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(20)

  const [search, setSearch] = useState("")

  const [subjectId, setSubjectId] = useState("")
  const [chapterId, setChapterId] = useState("")
  const [topicId, setTopicId] = useState("")

  const [difficulty, setDifficulty] = useState("")
  const [status, setStatus] = useState("")
  const [type, setType] = useState("")
  const [source, setSource] = useState("")

  const [sort, setSort] = useState("-createdAt")

  const [selectedQuestion, setSelectedQuestion] = useState<IQuestion | null>(
    null
  )

  const { data, isLoading, isFetching } = useGetQuestionsQuery({
    page,
    limit,

    searchTerm: search || undefined,

    subjectId: subjectId || undefined,
    chapterId: chapterId || undefined,
    topicId: topicId || undefined,

    difficulty: (difficulty || undefined) as QuestionDifficulty | undefined,

    status: (status || undefined) as QuestionStatus | undefined,

    type: (type || undefined) as QuestionType | undefined,

    source: (source || undefined) as QuestionSourceType | undefined,

    sortBy: "createdAt",
    sortOrder: sort === "-createdAt" ? "desc" : "asc",
  })

  const questions = data?.data?.data ?? []

  return (
    <div className="min-h-full space-y-6 pb-10">
      {/* Header */}
      <PageHeader
        title="Questions"
        description="Manage, review, and organize your question bank."
        action={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              className="h-9 border-border bg-background hover:bg-muted"
              onClick={() => router.push("/admin/questions/all-questions")}
            >
              All Questions
            </Button>

            <Button
              className="h-9 shadow-sm"
              onClick={() => router.push("/admin/questions/create")}
            >
              Add Question
            </Button>
          </div>
        }
      />
       {/* Stats */}
      <QuestionStats />

     

      {/* Filters */}
      <QuestionFilters
        subjectId={subjectId}
        setSubjectId={setSubjectId}
        chapterId={chapterId}
        setChapterId={setChapterId}
        topicId={topicId}
        setTopicId={setTopicId}
        difficulty={difficulty}
        setDifficulty={setDifficulty}
        status={status}
        setStatus={setStatus}
        type={type}
        setType={setType}
        source={source}
        setSource={setSource}
        sort={sort}
        setSort={setSort}
        setPage={setPage}
      />

      {/* Toolbar */}
      <QuestionToolbar
        search={search}
        onSearchChange={(value) => {
          setSearch(value)
          setPage(1)
        }}
        onCreate={() => router.push("/admin/questions/create")}
        onImport={() => console.log("Import")}
        onExport={() => console.log("Export")}
      />

      {/* Main content */}
      <div className="grid gap-6 grid-cols-12">
        {/* Questions table */}
        <div className="col-span-8 min-w-0 overflow-hidden rounded-xl border border-border/60 bg-card shadow-sm">
          <QuestionTable
            data={questions}
            loading={isLoading}
            isFetching={isFetching}
            pagination={data?.data?.meta}
            page={page}
            limit={limit}
            onPageChange={setPage}
            onLimitChange={setLimit}
            selectedQuestion={selectedQuestion}
            onSelectQuestion={setSelectedQuestion}
          />
        </div>

        {/* Details */}
        <div className="col-span-4 min-w-0 ">
          <QuestionDetailsPanel question={selectedQuestion} />
        </div>
      </div>
    </div>
  )
}
