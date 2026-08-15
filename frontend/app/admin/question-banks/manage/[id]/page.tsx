"use client"

import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Loader2 } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import { FetchBaseQueryError } from "@reduxjs/toolkit/query"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

import PageHeader from "@/app/customComponents/shared/PageHeader"

import QuestionSelectorTable from "@/app/customComponents/AdminDashboard/QuestionBanks/QuestionSelectorTable"
import SelectedQuestionsTable from "@/app/customComponents/AdminDashboard/QuestionBanks/SelectedQuestionsTable"

import AcademicFilters from "@/app/customComponents/AdminDashboard/ChaptersAndTopics/AcademicFilters"

import {
  useBulkAddQuestionsMutation,
  useGetQuestionsByBankQuery,
} from "@/app/redux/api/questionBankItemApi"

import { useGetSingleQuestionBankQuery } from "@/app/redux/api/questionBanksApi"

export default function ManageQuestionBankPage() {
  const router = useRouter()

  const { id } = useParams<{ id: string }>()

  /* ==========================================================
     FILTER STATE
  ========================================================== */

  const [search, setSearch] = useState("")

  const [subjectId, setSubjectId] = useState("all")

  const [chapterId, setChapterId] = useState("all")

  const [status, setStatus] = useState("all")

  const [sort, setSort] = useState("newest")

  /* ==========================================================
     SELECTED QUESTIONS
  ========================================================== */

  const [selectedQuestionIds, setSelectedQuestionIds] = useState<string[]>([])

  /* ==========================================================
     CLEAR FILTERS
  ========================================================== */

  function clearFilters() {
    setSearch("")
    setSubjectId("all")
    setChapterId("all")
    setStatus("all")
    setSort("newest")
  }

  /* ==========================================================
     QUESTION BANK
  ========================================================== */

  const { data: bankData, isLoading: loadingBank } =
    useGetSingleQuestionBankQuery(id)

  /* ==========================================================
     QUESTIONS ALREADY IN BANK
  ========================================================== */

  const { data, isLoading, refetch } = useGetQuestionsByBankQuery({
    questionBankId: id,
    page: 1,
    limit: 100,
  })

  /* ==========================================================
     BULK ADD
  ========================================================== */

  const [bulkAddQuestions, { isLoading: adding }] =
    useBulkAddQuestionsMutation()

  /* ==========================================================
     ADD SELECTED QUESTIONS
  ========================================================== */

  const handleAdd = async () => {
    if (selectedQuestionIds.length === 0) {
      toast.error("Select at least one question.")

      return
    }

    try {
      await bulkAddQuestions({
        questionBankId: id,

        data: {
          questionIds: selectedQuestionIds,
        },
      }).unwrap()

      toast.success("Questions added successfully")

      setSelectedQuestionIds([])

      await refetch()
    } catch (error) {
      const err = error as FetchBaseQueryError & {
        data?: {
          message?: string
        }
      }

      toast.error(err.data?.message || "Failed to add questions")
    }
  }

  /* ==========================================================
     LOADING
  ========================================================== */

  if (loadingBank) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin" />

          <span>Loading question bank...</span>
        </div>
      </main>
    )
  }

  /* ==========================================================
     PAGE
  ========================================================== */

  return (
    <main className="space-y-6 p-6">
      {/* ======================================================
          BACK
      ====================================================== */}

      <Button variant="outline" onClick={() => router.back()}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>

      {/* ======================================================
          HEADER
      ====================================================== */}

      <PageHeader
        title="Manage Question Bank"
        description={bankData?.data?.title || "Manage questions"}
      />

      <Separator />

      {/* ======================================================
          SELECTED / ADD
      ====================================================== */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="font-semibold">
            Selected: {selectedQuestionIds.length}
          </h3>

          <p className="text-sm text-muted-foreground">
            Select questions from the available questions list.
          </p>
        </div>

        <Button
          onClick={handleAdd}
          disabled={adding || selectedQuestionIds.length === 0}
        >
          {adding ? "Adding..." : "Add Selected"}
        </Button>
      </div>

      {/* ======================================================
          TWO COLUMN LAYOUT
      ====================================================== */}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        {/* ====================================================
            AVAILABLE QUESTIONS
        ==================================================== */}

        <div className="rounded-lg border bg-card">
          <div className="border-b p-4">
            <h2 className="font-semibold">Available Questions</h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Filter and select questions to add to this bank.
            </p>
          </div>

          <div className="space-y-4 p-4">
            {/* Filters */}

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

            {/* Question selector */}

            <QuestionSelectorTable
              search={search}
              subjectId={subjectId}
              chapterId={chapterId}
              status={status}
              sort={sort}
              onSelect={setSelectedQuestionIds}
            />
          </div>
        </div>

        {/* ====================================================
            QUESTIONS ALREADY IN BANK
        ==================================================== */}

        <div className="rounded-lg border bg-card">
          <div className="border-b p-4">
            <h2 className="font-semibold">Questions in Bank</h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Questions currently belonging to this question bank.
            </p>
          </div>

          <div className="p-4">
            <SelectedQuestionsTable
              loading={isLoading}
              data={data?.data?.data ?? []}
              bankId={id}
              onRefresh={refetch}
            />
          </div>
        </div>
      </div>
    </main>
  )
}
