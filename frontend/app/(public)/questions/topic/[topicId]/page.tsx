"use client"

import { use } from "react"
import { useRouter } from "next/navigation"

import { BookOpen, FileQuestion } from "lucide-react"

import { useGetTopicQuery } from "@/app/redux/api/topicsApi"
import { useGetQuestionsByTopicQuery } from "@/app/redux/api/questionsApi"
import { useAppSelector } from "@/app/redux/hooks"

import QuestionCard from "@/app/customComponents/PublicComponents/Subjects/QuestionCard"

interface PageProps {
  params: Promise<{
    topicId: string
  }>
}

export default function TopicQuestionsPage({ params }: PageProps) {
  const { topicId } = use(params)
  const router = useRouter()
  const user = useAppSelector((state) => state.auth.user)
  const isLoggedIn = !!user
  const { data: topicData, isLoading: topicLoading } = useGetTopicQuery(topicId)
  const { data: questionsData, isLoading: questionLoading } =
    useGetQuestionsByTopicQuery(topicId)
  const topic = topicData?.data
  const questions = questionsData?.data ?? []

const handleStartExam = () => {
 const configureUrl = `/configure?type=topic&topics=${topicId}`

  if (!isLoggedIn) {
    router.push(`/login?redirect=${encodeURIComponent(configureUrl)}`)
    return
  }
  router.push(configureUrl)
}

  if (topicLoading || questionLoading) {
    return (
      <div className="container mx-auto py-10 text-center">
        প্রশ্ন লোড হচ্ছে...
      </div>
    )
  }

  return (
    <div className="container mx-auto py-7">
      <div className="mb-8 bg-card p-6 px-10 md:px-20">
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <BookOpen className="h-6 w-6 text-primary" />
              <h1 className="text-2xl font-bold">{topic?.title}</h1>
            </div>

            <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
              <FileQuestion className="h-4 w-4" />
              <span>মোট {questions.length} টি প্রশ্ন</span>
            </div>

            <p className="mt-2 text-sm text-muted-foreground">
              প্রতিটি প্রশ্ন পড়ুন, সঠিক উত্তর দেখুন এবং বিস্তারিত ব্যাখ্যা থেকে
              বিষয়টি ভালোভাবে বুঝে নিন।
            </p>
          </div>

          <button
            onClick={handleStartExam}
            className="rounded-md bg-primary px-6 py-2 text-sm font-medium text-primary-foreground transition hover:opacity-90"
          >
            পরীক্ষা দিন
          </button>
        </div>
      </div>

      {questions.length === 0 ? (
        <div className="rounded-lg border py-12 text-center">
          <h2 className="text-lg font-semibold">কোনো প্রশ্ন পাওয়া যায়নি</h2>

          <p className="mt-2 text-sm text-muted-foreground">
            এই টপিকে এখনো কোনো প্রশ্ন যোগ করা হয়নি।
          </p>
        </div>
      ) : (
        <div className="space-y-2 px-12 lg:px-20">
          {questions.map((question, index) => (
            <QuestionCard
              key={question._id}
              question={question}
              index={index}
            />
          ))}
        </div>
      )}
    </div>
  )
}
