"use client"

import { useGetSingleQuestionBankQuery } from "@/app/redux/api/questionBanksApi"
import { useGetQuestionsByBankQuery } from "@/app/redux/api/questionBankItemApi"

import QuestionBankInfo from "./QuestionBankInfo"
import QuestionBankQuestions from "./QuestionBankQuestions"

interface Props {
  slug: string
}

export default function QuestionBankDetails({ slug }: Props) {
  // ===============================
  // প্রশ্ন ব্যাংক
  // ===============================

  const {
    data: bankResponse,
    isLoading: bankLoading,
    isError: bankError,
  } = useGetSingleQuestionBankQuery(slug)

  const bank = bankResponse?.data

  // ===============================
  // প্রশ্নগুলো
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
      <div className="flex min-h-96 items-center justify-center">
        <p className="text-sm text-muted-foreground">
          প্রশ্ন ব্যাংক লোড হচ্ছে...
        </p>
      </div>
    )
  }

  // ===============================
  // Error
  // ===============================

  if (bankError) {
    return (
      <div className="flex min-h-96 items-center justify-center px-4">
        <div className="text-center">
          <h2 className="font-semibold">প্রশ্ন ব্যাংকটি লোড করা যায়নি</h2>

          <p className="mt-2 text-sm text-muted-foreground">
            একটু পরে আবার চেষ্টা করুন।
          </p>
        </div>
      </div>
    )
  }

  // ===============================
  // Not Found
  // ===============================

  if (!bank) {
    return (
      <div className="flex min-h-96 items-center justify-center px-4">
        <div className="text-center">
          <h2 className="font-semibold">প্রশ্ন ব্যাংকটি পাওয়া যায়নি</h2>

          <p className="mt-2 text-sm text-muted-foreground">
            আপনি যে প্রশ্ন ব্যাংকটি খুঁজছেন, সেটি আর পাওয়া যাচ্ছে না।
          </p>
        </div>
      </div>
    )
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
