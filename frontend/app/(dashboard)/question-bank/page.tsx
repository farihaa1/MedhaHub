"use client"

import Link from "next/link"

import { Button } from "@/components/ui/button"

import QuestionBankTable from "@/app/customComponents/AdminDashboard/QuestionBanks/QuestionBankTable"
import { useGetQuestionBanksQuery } from "@/app/redux/api/questionBanksApi"

export default function QuestionBanksPage() {
  const { data: response, isLoading, isError } = useGetQuestionBanksQuery({})

  const questionBanks = response?.data?.data ?? []

  return (
    <main className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Question Banks</h1>

          <p className="mt-1 text-muted-foreground">
            Manage all question banks.
          </p>
        </div>

        <Button asChild>
          <Link href="/question-bank/create">Create Question Bank</Link>
        </Button>
      </div>

      {/* Error */}
      {isError ? (
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-6 text-center">
          <p className="font-medium text-destructive">
            Failed to load question banks.
          </p>

          <p className="mt-1 text-sm text-muted-foreground">
            Please try again later.
          </p>
        </div>
      ) : (
        <QuestionBankTable data={questionBanks} loading={isLoading} />
      )}
    </main>
  )
}
