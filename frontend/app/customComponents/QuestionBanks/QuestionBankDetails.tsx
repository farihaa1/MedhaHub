"use client"

import { useGetSingleQuestionBankQuery } from "@/app/redux/api/questionBanksApi"
import { useGetQuestionsByBankQuery } from "@/app/redux/api/questionBankItemApi"

import QuestionBankInfo from "./QuestionBankInfo"
import QuestionBankQuestions from "./QuestionBankQuestions"
import { useMeQuery } from "@/app/redux/api/authApi"

interface Props {
  slug: string
}

export default function QuestionBankDetails({ slug }: Props) {
  // ===============================
  // Get Question Bank
  // ===============================
  const {
    data: bankResponse,
    isLoading: bankLoading,
    isError: bankError,
  } = useGetSingleQuestionBankQuery(slug)

  const bank = bankResponse?.data

 const { data, isLoading, isFetching, isError } = useMeQuery(undefined)

  // ===============================
  // Get Questions
  // ===============================
  const { data: questionResponse, isLoading: questionsLoading } =
    useGetQuestionsByBankQuery(
      {
        questionBankId: bank?._id ?? "",
      },
      {
        skip: !bank,
      }
    )

  const questions = questionResponse?.data?.data ?? []

  // ===============================
  // Loading
  // ===============================
  if (bankLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        Loading Question Bank...
      </div>
    )
  }

  // ===============================
  // Error
  // ===============================
  if (bankError) {
    return (
      <div className="py-20 text-center text-red-500">
        Failed to load Question Bank.
      </div>
    )
  }

  // ===============================
  // Not Found
  // ===============================
  if (!bank) {
    return <div className="py-20 text-center">Question Bank Not Found</div>
  }

  // ===============================
  // Render
  // ===============================
  return (
    <main className="mx-auto max-w-6xl space-y-8 px-4 py-10">
      <QuestionBankInfo bank={bank} totalQuestions={questions.length} />

      <QuestionBankQuestions questions={questions} loading={questionsLoading} />
    </main>
  )
}
