"use client"

import { useState } from "react"
import { useGetQuestionsQuery } from "@/app/redux/api/questionsApi"

import PaginationBar from "@/app/customComponents/AdminDashboard/Questions/pagination"
import QuestionCard from "@/app/customComponents/PublicComponents/Subjects/QuestionCard"

export default function QuestionsPage() {
  const [page, setPage] = useState(1)

  const { data, isLoading } = useGetQuestionsQuery({
    page,
    limit: 20,
  })
console.log(data)
  if (isLoading) {
    return <div className="p-10">Loading...</div>
  }
  const questions = data?.data?.data ?? []
  return (
    <div className="space-y-6 p-8">
      <div>
        <h1 className="text-3xl font-bold">All Questions</h1>

        <p className="text-muted-foreground">
          {data?.data.meta.total} Questions
        </p>
      </div>

      <div className="mx-auto max-w-5xl space-y-8 py-10">
        {questions.map((question, index) => (
          <QuestionCard
            key={question._id}
            question={question}
          />
        ))}
      </div>
      <PaginationBar
        currentPage={data?.data.meta.page ?? 1}
        totalPage={data?.data.meta.totalPage ?? 1}
        onPageChange={setPage}
      />
    </div>
  )
}
