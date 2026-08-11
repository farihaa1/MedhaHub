"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"

import { Button } from "@/components/ui/button"

import PageHeader from "@/app/customComponents/shared/PageHeader"
import QuestionStats from "@/app/customComponents/AdminDashboard/Questions/QuestionStats"
import QuestionFilters from "@/app/customComponents/AdminDashboard/Questions/QuestionFilters"
import QuestionTable from "@/app/customComponents/AdminDashboard/Questions/QuestionTable"
import QuestionDetailsPanel from "@/app/customComponents/AdminDashboard/Questions/QuestionDetailsPanel"

import {
  QuestionDifficulty,
  QuestionSourceType,
  QuestionStatus,
  QuestionType,
  useGetQuestionsQuery,
  type QuestionQuery,
} from "@/app/redux/api/questionsApi"

export default function QuestionsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  /* ============================================================
     INITIAL STATE FROM URL
  ============================================================ */

  const getNumberParam = (name: string, fallback: number) => {
    const value = Number(searchParams.get(name))

    return Number.isFinite(value) && value > 0 ? value : fallback
  }

  const [page, setPage] = useState<number>(() => getNumberParam("page", 1))

  const [limit, setLimit] = useState<number>(() => getNumberParam("limit", 10))

  /* ============================================================
     SEARCH
  ============================================================ */

  const [search, setSearch] = useState<string>(
    () => searchParams.get("search") ?? ""
  )

  const [sourceTitle, setSourceTitle] = useState<string>(
    () => searchParams.get("sourceTitle") ?? ""
  )

  /* ============================================================
     ACADEMIC FILTERS
  ============================================================ */

  const [subjectId, setSubjectId] = useState<string>(
    () => searchParams.get("subjectId") ?? ""
  )

  const [chapterId, setChapterId] = useState<string>(
    () => searchParams.get("chapterId") ?? ""
  )

  const [topicId, setTopicId] = useState<string>(
    () => searchParams.get("topicId") ?? ""
  )

  /* ============================================================
     METADATA FILTERS
  ============================================================ */

  const [difficulty, setDifficulty] = useState<string>(
    () => searchParams.get("difficulty") ?? ""
  )

  const [status, setStatus] = useState<string>(
    () => searchParams.get("status") ?? ""
  )

  const [type, setType] = useState<string>(() => searchParams.get("type") ?? "")

  const [source, setSource] = useState<string>(
    () => searchParams.get("source") ?? ""
  )

  /* ============================================================
     SORT
  ============================================================ */

  const [sort, setSort] = useState<string>(
    () => searchParams.get("sort") ?? "-createdAt"
  )

  /* ============================================================
     SELECTED QUESTION
  ============================================================ */

  const [selectedQuestionId, setSelectedQuestionId] = useState<string | null>(
    () => searchParams.get("selectedQuestion") ?? null
  )

  /* ============================================================
     SYNC STATE -> URL
  ============================================================ */

  useEffect(() => {
    const params = new URLSearchParams()

    /* Pagination */

    if (page > 1) {
      params.set("page", String(page))
    }

    if (limit !== 10) {
      params.set("limit", String(limit))
    }

    /* Search */

    if (search.trim()) {
      params.set("search", search.trim())
    }

    if (sourceTitle.trim()) {
      params.set("sourceTitle", sourceTitle.trim())
    }

    /* Academic */

    if (subjectId) {
      params.set("subjectId", subjectId)
    }

    if (chapterId) {
      params.set("chapterId", chapterId)
    }

    if (topicId) {
      params.set("topicId", topicId)
    }

    /* Metadata */

    if (difficulty) {
      params.set("difficulty", difficulty)
    }

    if (status) {
      params.set("status", status)
    }

    if (type) {
      params.set("type", type)
    }

    if (source) {
      params.set("source", source)
    }

    /* Sort */

    if (sort !== "-createdAt") {
      params.set("sort", sort)
    }

    /* Selected question */

    if (selectedQuestionId) {
      params.set("selectedQuestion", selectedQuestionId)
    }

    const query = params.toString()

    router.replace(query ? `/admin/questions?${query}` : "/admin/questions", {
      scroll: false,
    })
  }, [
    page,
    limit,

    search,
    sourceTitle,

    subjectId,
    chapterId,
    topicId,

    difficulty,
    status,
    type,
    source,

    sort,

    selectedQuestionId,

    router,
  ])

  /* ============================================================
     QUERY
  ============================================================ */

  const queryParams: QuestionQuery = {
    page,
    limit,

    /* Question search */

    searchTerm: search.trim() || undefined,

    /* Source title search */

    sourceTitle: sourceTitle.trim() || undefined,

    /* Academic */

    subjectId: subjectId || undefined,

    chapterId: chapterId || undefined,

    topicId: topicId || undefined,

    /* Metadata */

    difficulty: difficulty ? (difficulty as QuestionDifficulty) : undefined,

    status: status ? (status as QuestionStatus) : undefined,

    type: type ? (type as QuestionType) : undefined,

    source: source ? (source as QuestionSourceType) : undefined,

    /* Sort */

    sortBy: sort.startsWith("-") ? sort.substring(1) : sort,

    sortOrder: sort.startsWith("-") ? "desc" : "asc",
  }

  const { data, isLoading, isFetching, isError, error } =
    useGetQuestionsQuery(queryParams)

  /* ============================================================
     QUESTIONS
  ============================================================ */

  const questions = data?.data?.data ?? []

  /* ============================================================
     PAGE CHANGE
  ============================================================ */

  const handlePageChange = (newPage: number) => {
    if (newPage < 1) return

    const totalPages = data?.data?.meta?.totalPage ?? 1

    if (newPage > totalPages) return

    setPage(newPage)

    /*
     * Usually clear selection when
     * moving to another table page.
     *
     * Remove this if you want to keep
     * the selected question ID.
     */

    setSelectedQuestionId(null)
  }

  /* ============================================================
     LIMIT CHANGE
  ============================================================ */

  const handleLimitChange = (newLimit: number) => {
    setLimit(newLimit)

    setPage(1)

    setSelectedQuestionId(null)
  }

  /* ============================================================
     SELECT QUESTION
  ============================================================ */

  const handleSelectQuestion = (id: string | null) => {
    setSelectedQuestionId(id)
  }

  /* ============================================================
     RENDER
  ============================================================ */

  return (
    <div className="min-h-full space-y-6 pb-10">
      {/* ======================================================
          HEADER
      ====================================================== */}

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

      {/* ======================================================
          STATS
      ====================================================== */}

      <QuestionStats />

      {/* ======================================================
          FILTERS + SEARCH
      ====================================================== */}

      <QuestionFilters
        search={search}
        setSearch={setSearch}

        sourceTitle={sourceTitle}
        setSourceTitle={setSourceTitle}

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

      {/* ======================================================
          ERROR
      ====================================================== */}

      {isError && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
          Failed to load questions.
          <pre className="mt-2 overflow-auto text-xs">
            {JSON.stringify(error, null, 2)}
          </pre>
        </div>
      )}

      {/* ======================================================
          TABLE + DETAILS
      ====================================================== */}

      <div className="grid grid-cols-12 gap-6">
        {/* TABLE */}

        <div className="col-span-12 min-w-0 overflow-hidden rounded-xl border border-border/60 bg-card shadow-sm lg:col-span-7">
          <QuestionTable
            data={questions}
            loading={isLoading}
            isFetching={isFetching}
            pagination={data?.data?.meta}
            page={page}
            limit={limit}
            onPageChange={handlePageChange}
            onLimitChange={handleLimitChange}
            selectedQuestionId={selectedQuestionId}
            onSelectQuestion={handleSelectQuestion}
          />
        </div>

        {/* DETAILS */}

        <div className="col-span-12 min-w-0 overflow-hidden rounded-xl border border-border/60 bg-card shadow-sm lg:col-span-5">
          <QuestionDetailsPanel questionId={selectedQuestionId} />
        </div>
      </div>
    </div>
  )
}
