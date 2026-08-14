"use client"

import { useGetQuestionBanksQuery } from "@/app/redux/api/questionBanksApi"
import { questionBankCategories } from "@/lib/questionBankCategories"

import QuestionBanksLoading from "./QuestionBanksLoading"
import QuestionBanksHeader from "./QuestionBanksHeader"
import QuestionBanksGrid from "./QuestionBanksGrid"
import QuestionBanksEmpty from "./QuestionBanksEmpty"

import { TQuestionBankCategory } from "@/app/redux/types/questionBank.types"

interface Props {
  category: TQuestionBankCategory
}

export default function QuestionBanksContainer({ category }: Props) {
  const categoryInfo = questionBankCategories.find(
    (item) => item.slug === category
  )

  const { data, isLoading, isFetching, isError } = useGetQuestionBanksQuery({
    category,
    status: "PUBLISHED",
  })

  if (!categoryInfo) {
    return (
      <div className="container py-20 text-center">
        <h2 className="font-semibold">ক্যাটাগরি পাওয়া যায়নি</h2>

        <p className="mt-2 text-sm text-muted-foreground">
          আপনি যে ক্যাটাগরিটি খুঁজছেন সেটি পাওয়া যায়নি।
        </p>
      </div>
    )
  }

  if (isLoading || isFetching) {
    return <QuestionBanksLoading />
  }

  if (isError) {
    return (
      <div className="container py-20 text-center">
        <h2 className="font-semibold">প্রশ্নব্যাংক লোড করা যায়নি</h2>

        <p className="mt-2 text-sm text-muted-foreground">
          কিছু একটা সমস্যা হয়েছে। একটু পরে আবার চেষ্টা করুন।
        </p>
      </div>
    )
  }

  const banks = data?.data?.data ?? []

  return (
    <main className="container mx-auto space-y-8 px-4 py-8 md:px-10 lg:px-16">
      <QuestionBanksHeader category={categoryInfo} />

      {banks.length > 0 ? (
        <QuestionBanksGrid banks={banks} />
      ) : (
        <QuestionBanksEmpty />
      )}
    </main>
  )
}
