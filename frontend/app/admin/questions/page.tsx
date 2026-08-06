"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

import PageHeader from "@/app/customComponents/shared/PageHeader"
import QuestionStats from "@/app/customComponents/AdminDashboard/Questions/QuestionStats"
import QuestionToolbar from "@/app/customComponents/AdminDashboard/Questions/QuestionToolbar"
import QuestionFilters from "@/app/customComponents/AdminDashboard/Questions/QuestionFilters"
import QuestionTable from "@/app/customComponents/AdminDashboard/Questions/QuestionTable"

import {
  useGetQuestionsQuery,
  QuestionDifficulty,
  QuestionStatus,
  QuestionType,
  QuestionSourceType,
} from "@/app/redux/api/questionsApi"

export default function QuestionsPage() {
  const router = useRouter()

  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)

  const [search, setSearch] = useState("")

  const [subjectId, setSubjectId] = useState("")
  const [chapterId, setChapterId] = useState("")
  const [topicId, setTopicId] = useState("")

  const [difficulty, setDifficulty] = useState("")
  const [status, setStatus] = useState("")
  const [type, setType] = useState("")
  const [source, setSource] = useState("")

  const [sort, setSort] = useState("-createdAt")

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

  console.log("Questions API Response", data)

  return (
    <div className="space-y-6 lg:px-16">
      <PageHeader
        title="Questions"
        description="Manage all questions"
        action={
          <div className="flex gap-4">
            <Button onClick={() => router.push("/admin/questions/all-questions")}>
              <Plus className="mr-2 h-4 w-4" />
              All Questions
            </Button>
            <Button onClick={() => router.push("/admin/questions/create")}>
              <Plus className="mr-2 h-4 w-4" />
              Add Question
            </Button>
          </div>
        }
      />

      <QuestionStats />
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

      <QuestionToolbar
        search={search}
        onSearchChange={setSearch}
        onCreate={() => router.push("/admin/questions/create")}
        onImport={() => console.log("Import")}
        onExport={() => console.log("Export")}
      />

      <QuestionTable
        data={data?.data?.data ?? []}
        loading={isLoading}
        isFetching={isFetching}
        pagination={data?.data?.meta}
        page={page}
        limit={limit}
        onPageChange={setPage}
        onLimitChange={setLimit}
      />
    </div>
  )
}
