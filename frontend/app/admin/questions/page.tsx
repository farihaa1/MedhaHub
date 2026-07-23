"use client"

import { useState } from "react"

import PageHeader from "@/app/customComponents/shared/PageHeader"

import QuestionStats from "@/app/customComponents/AdminDashboard/Questions/QuestionStats"
import QuestionToolbar from "@/app/customComponents/AdminDashboard/Questions/QuestionToolbar"
import QuestionFilters from "@/app/customComponents/AdminDashboard/Questions/QuestionFilters"
import QuestionTable from "@/app/customComponents/AdminDashboard/Questions/QuestionTable"

import CreateQuestionDialog from "@/app/customComponents/AdminDashboard/Questions/CreateQuestionDialog"
import BulkActionsDropdown from "@/app/customComponents/AdminDashboard/Questions/BulkActionsDropdown"

export default function AdminQuestionsPage() {
  const [search, setSearch] = useState("")

  const [subjectId, setSubjectId] = useState("all")

  const [chapterId, setChapterId] = useState("all")

  const [topicId, setTopicId] = useState("all")

  const [difficulty, setDifficulty] = useState("all")

  const [type, setType] = useState("all")

  const [status, setStatus] = useState("all")

  const [source, setSource] = useState("all")

  const [sort, setSort] = useState("newest")

  const [selectedIds, setSelectedIds] = useState<string[]>([])

  function clearFilters() {
    setSearch("")
    setSubjectId("all")
    setChapterId("all")
    setTopicId("all")
    setDifficulty("all")
    setType("all")
    setStatus("all")
    setSource("all")
    setSort("newest")
  }

  return (
    <div className="space-y-6 px-12">
      <PageHeader
        title="Question Management"
        description="Create, organize, review and manage all questions."
        action={
          <div className="flex gap-2">
            <BulkActionsDropdown selectedIds={selectedIds} />

            <CreateQuestionDialog />
          </div>
        }
      />

      <QuestionStats />

      <QuestionToolbar
        onRefresh={() => window.location.reload()}
        onExport={() => {
          console.log("Export Questions")
        }}
      />

      <QuestionFilters
        search={search}
        subjectId={subjectId}
        chapterId={chapterId}
        topicId={topicId}
        difficulty={difficulty}
        type={type}
        status={status}
        source={source}
        sort={sort}
        onSearchChange={setSearch}
        onSubjectChange={setSubjectId}
        onChapterChange={setChapterId}
        onTopicChange={setTopicId}
        onDifficultyChange={setDifficulty}
        onTypeChange={setType}
        onStatusChange={setStatus}
        onSourceChange={setSource}
        onSortChange={setSort}
        onClear={clearFilters}
      />

      <QuestionTable
        search={search}
        subjectId={subjectId}
        chapterId={chapterId}
        topicId={topicId}
        difficulty={difficulty}
        type={type}
        status={status}
        source={source}
        sort={sort}
      />
    </div>
  )
}
