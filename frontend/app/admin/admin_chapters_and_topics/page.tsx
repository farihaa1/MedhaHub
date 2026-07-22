"use client"

import { useState } from "react"

import PageHeader from "@/app/customComponents/AdminDashboard/AdminSubjects/PageHeader"

import AcademicStats from "@/app/customComponents/AdminDashboard/ChaptersAndTopics/AcademicStats"
import AcademicToolbar from "@/app/customComponents/AdminDashboard/ChaptersAndTopics/AcademicToolbar"
import AcademicFilters from "@/app/customComponents/AdminDashboard/ChaptersAndTopics/AcademicFilters"
import AcademicTree from "@/app/customComponents/AdminDashboard/ChaptersAndTopics/AcademicTree"

import CreateChapterDialog from "@/app/customComponents/AdminDashboard/ChaptersAndTopics/CreateChapterDialog"
import BulkImportDialog from "@/app/customComponents/AdminDashboard/ChaptersAndTopics/BulkImportDialog"

import { Button } from "@/components/ui/button"

export default function AdminChaptersAndTopicsPage() {
  const [search, setSearch] = useState("")

  const [subjectId, setSubjectId] = useState("all")

  const [chapterId, setChapterId] = useState("all")

  const [status, setStatus] = useState("all")

  const [sort, setSort] = useState("newest")

  function clearFilters() {
    setSearch("")
    setSubjectId("all")
    setChapterId("all")
    setStatus("all")
    setSort("newest")
  }

  return (
    <div className="space-y-6 px-12">
      <PageHeader
        title="Academic Management"
        description="Manage subjects, chapters and topics across the entire platform."
        action={
          <div className="flex gap-2">
            <BulkImportDialog />

            <CreateChapterDialog />

            <Button variant="outline">Export</Button>
          </div>
        }
      />

      <AcademicStats />
      <AcademicToolbar
        onRefresh={() => window.location.reload()}
        onExport={() => {
          console.log("Export Academic Data")
        }}
      />

      <AcademicFilters
        search={search}
        subjectId={subjectId}
        chapterId={chapterId}
        status={status}
        sort={sort}
        onSearchChange={setSearch}
        onSubjectChange={setSubjectId}
        onChapterChange={setChapterId}
        onStatusChange={setStatus}
        onSortChange={setSort}
        onClear={clearFilters}
      />

      <AcademicTree
        search={search}
        subjectId={subjectId}
        chapterId={chapterId}
        status={status}
        sort={sort}
      />
    </div>
  )
}
