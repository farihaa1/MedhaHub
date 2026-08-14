"use client"

import { use } from "react"
import { useRouter } from "next/navigation"

import { BookOpen, FileQuestion } from "lucide-react"

import { useGetTopicQuery } from "@/app/redux/api/topicsApi"
import { useGetQuestionsByTopicQuery } from "@/app/redux/api/questionsApi"
import { useAppSelector } from "@/app/redux/hooks"

import QuestionCard from "@/app/customComponents/PublicComponents/Subjects/QuestionCard"
import QuestionCardSkeleton from "@/app/customComponents/PublicComponents/Subjects/QuestionCardSkeleton"

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

  /*
   * --------------------------------
   * Topic
   * --------------------------------
   */

  const {
    data: topicData,
    isLoading: topicLoading,
    isError: topicError,
  } = useGetTopicQuery(topicId, {
    skip: !topicId,
  })

  /*
   * --------------------------------
   * Questions
   * --------------------------------
   */

  const {
    data: questionsData,
    isLoading: questionsLoading,
    isError: questionsError,
  } = useGetQuestionsByTopicQuery(topicId, {
    skip: !topicId,
  })

  const topic = topicData?.data
  const questions = questionsData?.data ?? []

  /*
   * --------------------------------
   * Start exam
   * --------------------------------
   */

  const handleStartExam = () => {
    const configureUrl = `/configure?type=topic&topics=${topicId}`

    if (!isLoggedIn) {
      router.push(`/login?redirect=${encodeURIComponent(configureUrl)}`)

      return
    }

    router.push(configureUrl)
  }

  /*
   * --------------------------------
   * Loading
   * --------------------------------
   */

  if (topicLoading || questionsLoading) {
    return (
      <main className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-7 sm:px-6 lg:px-8">
          {/* Header skeleton */}
          <div className="mb-8 rounded-xl border bg-card p-6 md:px-10">
            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
              <div className="w-full space-y-4">
                {/* Topic title */}
                <div className="flex items-center gap-2">
                  <div className="h-6 w-6 animate-pulse rounded bg-muted" />

                  <div className="h-8 w-64 max-w-full animate-pulse rounded bg-muted" />
                </div>

                {/* Question count */}
                <div className="h-4 w-36 animate-pulse rounded bg-muted" />

                {/* Description */}
                <div className="space-y-2">
                  <div className="h-4 w-full max-w-2xl animate-pulse rounded bg-muted" />

                  <div className="h-4 w-3/4 max-w-xl animate-pulse rounded bg-muted" />
                </div>
              </div>

              {/* Exam button */}
              <div className="h-10 w-28 animate-pulse rounded-md bg-muted" />
            </div>
          </div>

          {/* Question cards */}
          <div className="space-y-5 px-0 md:px-8 lg:px-16">
            {Array.from({ length: 5 }).map((_, index) => (
              <QuestionCardSkeleton key={index} />
            ))}
          </div>
        </div>
      </main>
    )
  }

  /*
   * --------------------------------
   * Topic error
   * --------------------------------
   */
  if (topicError || !topic) {
    return (
      <main className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
          <div className="rounded-xl border border-dashed p-10 text-center">
            <BookOpen className="mx-auto h-8 w-8 text-muted-foreground" />

            <h2 className="mt-4 font-semibold">টপিকটি পাওয়া যায়নি</h2>

            <p className="mt-2 text-sm text-muted-foreground">
              আপনি যে টপিকটি খুঁজছেন সেটি পাওয়া যায়নি।
            </p>
          </div>
        </div>
      </main>
    )
  }

  /*
   * --------------------------------
   * Questions error
   * --------------------------------
   */

if (questionsError) {
  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="rounded-xl border border-dashed p-10 text-center">
          <FileQuestion className="mx-auto h-8 w-8 text-muted-foreground" />

          <h2 className="mt-4 font-semibold">প্রশ্ন লোড করা যায়নি</h2>

          <p className="mt-2 text-sm text-muted-foreground">
            প্রশ্নগুলো লোড করার সময় একটি সমস্যা হয়েছে। অনুগ্রহ করে কিছুক্ষণ পর
            আবার চেষ্টা করুন।
          </p>
        </div>
      </div>
    </main>
  )
}

  /*
   * --------------------------------
   * Page
   * --------------------------------
   */

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-7 sm:px-6 lg:px-8">
        {/* Topic Header */}
        <div className="mb-8 rounded-xl border bg-card p-6 md:px-10">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <BookOpen className="h-6 w-6 text-primary" />

                <h1 className="text-2xl font-bold">{topic.title}</h1>
              </div>

              <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
                <FileQuestion className="h-4 w-4" />

                <span>মোট {questions.length}টি প্রশ্ন</span>
              </div>

              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                প্রতিটি প্রশ্ন পড়ুন, সঠিক উত্তর দেখুন এবং বিস্তারিত ব্যাখ্যা
                থেকে বিষয়টি ভালোভাবে বুঝে নিন।
              </p>
            </div>

            <button
              type="button"
              onClick={handleStartExam}
              className="rounded-md bg-primary px-6 py-2 text-sm font-medium text-primary-foreground transition hover:opacity-90"
            >
              পরীক্ষা শুরু করুন
            </button>
          </div>
        </div>

        {/* Questions */}
        {questions.length === 0 ? (
          <div className="rounded-xl border border-dashed py-12 text-center">
            <FileQuestion className="mx-auto h-8 w-8 text-muted-foreground" />

            <h2 className="mt-4 text-lg font-semibold">
              কোনো প্রশ্ন পাওয়া যায়নি
            </h2>

            <p className="mt-2 text-sm text-muted-foreground">
              এই টপিকে এখনো কোনো প্রশ্ন যোগ করা হয়নি।
            </p>
          </div>
        ) : (
          <div className="space-y-5 px-0 md:px-8 lg:px-16">
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
    </main>
  )
}
