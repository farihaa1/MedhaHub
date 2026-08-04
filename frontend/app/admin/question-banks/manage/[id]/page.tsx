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

import {
  useBulkAddQuestionsMutation,
  useGetQuestionsByBankQuery,
} from "@/app/redux/api/questionBankItemApi"

import { useGetSingleQuestionBankQuery } from "@/app/redux/api/questionBanksApi"

export default function ManageQuestionBankPage() {
  const router = useRouter()
  const { id } = useParams<{ id: string }>()

  const [selectedQuestionIds, setSelectedQuestionIds] = useState<string[]>([])

  const { data: bankData, isLoading: loadingBank } =
    useGetSingleQuestionBankQuery(id)

  const { data, isLoading, refetch } = useGetQuestionsByBankQuery({
    questionBankId: id,
    page: 1,
    limit: 100,
  })

  const [bulkAddQuestions, { isLoading: adding }] =
    useBulkAddQuestionsMutation()

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

      refetch()
    } catch (error) {
      const err = error as FetchBaseQueryError & {
        data?: {
          message?: string
        }
      }

      toast.error(err.data?.message || "Failed to add questions")
    }
  }

  if (loadingBank) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6">
      <Button variant="outline" onClick={() => router.back()}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>

      <PageHeader
        title="Manage Question Bank"
        description={bankData?.data.title}
      />

      <Separator />

      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold">
            Selected: {selectedQuestionIds.length}
          </h3>
        </div>

        <Button
          onClick={handleAdd}
          disabled={adding || selectedQuestionIds.length === 0}
        >
          Add Selected
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <div className="rounded-lg border">
          <div className="border-b p-4 font-semibold">Available Questions</div>

          <div className="p-4">
            <QuestionSelectorTable
              bankId={id}
              onSelect={setSelectedQuestionIds}
            />
          </div>
        </div>

        <div className="rounded-lg border">
          <div className="border-b p-4 font-semibold">Questions in Bank</div>

          <div className="p-4">
            <SelectedQuestionsTable
              loading={isLoading}
              data={data?.data.data ?? []}
              bankId={id}
              onRefresh={refetch}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
