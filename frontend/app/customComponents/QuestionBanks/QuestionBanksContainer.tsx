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
 console.log(data)

  if (!categoryInfo) {
    return (
      <div className="container py-20 text-center">Category not found.</div>
    )
  }

  if (isLoading || isFetching) {
    return <QuestionBanksLoading />
  }

  if (isError) {
    return (
      <div className="container py-20 text-center">Something went wrong.</div>
    )
  }

 
  const banks = data?.data?.data ?? []

  return (
    <main className="container mx-auto space-y-8 py-8 px-4 md:px-10 lg:px-16">
      <QuestionBanksHeader category={categoryInfo} />

      {banks.length ? (
        <QuestionBanksGrid banks={banks} />
      ) : (
        <QuestionBanksEmpty />
      )}
    </main>
  )
}
