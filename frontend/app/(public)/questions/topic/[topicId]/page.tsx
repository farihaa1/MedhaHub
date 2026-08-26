"use client"

import { use, useState } from "react"
import { useRouter } from "next/navigation"

import { BookOpen, FileQuestion, FileText, Plus, Pencil } from "lucide-react"

import { useGetTopicQuery } from "@/app/redux/api/topicsApi"

import { useGetQuestionsByTopicQuery } from "@/app/redux/api/questionsApi"

import {
  useGetTopicContentQuery,
  useGetPublishedTopicContentQuery,
} from "@/app/redux/api/topicContentApi"

import { useAppSelector } from "@/app/redux/hooks"

import QuestionCard from "@/app/customComponents/PublicComponents/Subjects/QuestionCard"

import QuestionCardSkeleton from "@/app/customComponents/PublicComponents/Subjects/QuestionCardSkeleton"

import TopicContentDialog from "@/app/customComponents/AdminDashboard/TopicContentDialog"
import MarkdownText from "@/app/customComponents/AdminDashboard/MarkdownText"



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

  const isAdmin = user?.role === "admin"

  const [contentDialogOpen, setContentDialogOpen] = useState(false)

  // =========================================================
  // TOPIC
  // =========================================================

  const {
    data: topicResponse,
    isLoading: topicLoading,
    isError: topicError,
  } = useGetTopicQuery(topicId, {
    skip: !topicId,
  })

  // =========================================================
  // QUESTIONS
  // =========================================================

  const {
    data: questionsResponse,
    isLoading: questionsLoading,
    isError: questionsError,
  } = useGetQuestionsByTopicQuery(topicId, {
    skip: !topicId,
  })

  // =========================================================
  // ADMIN CONTENT
  // =========================================================

  const { data: adminContentResponse, isLoading: adminContentLoading } =
    useGetTopicContentQuery(topicId, {
      skip: !topicId || !isAdmin,
    })

  // =========================================================
  // PUBLISHED CONTENT
  // =========================================================

  const { data: publishedContentResponse, isLoading: publishedContentLoading } =
    useGetPublishedTopicContentQuery(topicId, {
      skip: !topicId || isAdmin,
    })

  // =========================================================
  // EXTRACT DATA
  // =========================================================

  const topic = topicResponse?.data

  const questions = questionsResponse?.data ?? []

  const adminContent = adminContentResponse?.data ?? null

  const publishedContent = publishedContentResponse?.data ?? null

  const content = isAdmin ? adminContent : publishedContent

  // =========================================================
  // CONTENT
  // =========================================================

  const hasContent = !!content && Array.isArray(content.bullets)

  const hasBullets = hasContent && content.bullets.length > 0

  const contentLoading = isAdmin ? adminContentLoading : publishedContentLoading

  // =========================================================
  // START EXAM
  // =========================================================

  const handleStartExam = () => {
    const configureUrl = `/configure?type=topic&topics=${topicId}`

    if (!isLoggedIn) {
      router.push(`/login?redirect=${encodeURIComponent(configureUrl)}`)

      return
    }

    router.push(configureUrl)
  }

  // =========================================================
  // CONTENT CLICK
  // =========================================================

  const handleContentClick = () => {
    if (isAdmin) {
      setContentDialogOpen(true)
      return
    }

    router.push(`/topics/${topicId}/content`)
  }

  // =========================================================
  // LOADING
  // =========================================================

  if (topicLoading || questionsLoading || contentLoading) {
    return (
      <main className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-7 sm:px-6 lg:px-8">
          {/* Header skeleton */}

          <div className="mb-8 rounded-xl border bg-card p-6 md:px-10">
            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
              <div className="w-full space-y-4">
                <div className="flex items-center gap-2">
                  <div className="h-6 w-6 animate-pulse rounded bg-muted" />

                  <div className="h-8 w-64 max-w-full animate-pulse rounded bg-muted" />
                </div>

                <div className="h-4 w-36 animate-pulse rounded bg-muted" />

                <div className="space-y-2">
                  <div className="h-4 w-full max-w-2xl animate-pulse rounded bg-muted" />

                  <div className="h-4 w-3/4 max-w-xl animate-pulse rounded bg-muted" />
                </div>
              </div>

              <div className="h-10 w-28 animate-pulse rounded-md bg-muted" />
            </div>
          </div>

          {/* Question skeletons */}

          <div className="space-y-5 px-0 md:px-8 lg:px-16">
            {Array.from({ length: 5 }).map((_, index) => (
              <QuestionCardSkeleton key={index} />
            ))}
          </div>
        </div>
      </main>
    )
  }

  // =========================================================
  // TOPIC ERROR
  // =========================================================

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

  // =========================================================
  // QUESTIONS ERROR
  // =========================================================

  if (questionsError) {
    return (
      <main className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
          <div className="rounded-xl border border-dashed p-10 text-center">
            <FileQuestion className="mx-auto h-8 w-8 text-muted-foreground" />

            <h2 className="mt-4 font-semibold">প্রশ্ন লোড করা যায়নি</h2>

            <p className="mt-2 text-sm text-muted-foreground">
              প্রশ্নগুলো লোড করার সময় একটি সমস্যা হয়েছে।
            </p>
          </div>
        </div>
      </main>
    )
  }

  // =========================================================
  // PAGE
  // =========================================================

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-7 sm:px-6 lg:px-8">
        {/* ===================================================
            TOPIC HEADER
        =================================================== */}

        <div className="mb-8 rounded-xl border-none bg-card p-6 md:px-10">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div>
              {/* Topic title */}

              <div className="flex items-center gap-2">
                <BookOpen className="h-6 w-6 text-primary" />

                <h1 className="text-lg font-bold">{topic.title}</h1>
              </div>

              {/* Question count */}

              <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                <FileQuestion className="h-4 w-4" />

                <span>মোট {questions.length}টি প্রশ্ন</span>
              </div>

              {/* Description */}

              <p className="mt-2 text-xs leading-6 text-muted-foreground">
                প্রতিটি প্রশ্ন পড়ুন, সঠিক উত্তর দেখুন এবং বিস্তারিত ব্যাখ্যা
                থেকে বিষয়টি ভালোভাবে বুঝে নিন।
              </p>
            </div>

            {/* =================================================
                BUTTONS
            ================================================= */}

            <div className="flex flex-wrap items-center gap-3">
              {/* STUDY CONTENT */}

              {hasContent && (
                <button
                  type="button"
                  onClick={handleContentClick}
                  className="inline-flex items-center gap-2 rounded-md border border-primary px-4 py-2 text-sm font-medium text-primary transition hover:bg-primary/10"
                >
                  {isAdmin ? (
                    <Pencil className="h-4 w-4" />
                  ) : (
                    <FileText className="h-4 w-4" />
                  )}

                  {isAdmin ? "Update Content" : "Study Content"}
                </button>
              )}

              {/* CREATE CONTENT */}

              {isAdmin && !hasContent && (
                <button
                  type="button"
                  onClick={handleContentClick}
                  className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:opacity-90"
                >
                  <Plus className="h-4 w-4" />
                  Create Content
                </button>
              )}

              {/* EXAM */}

              <button
                type="button"
                onClick={handleStartExam}
                className="rounded-md bg-primary px-6 py-2 text-sm font-medium text-primary-foreground transition hover:opacity-90"
              >
                পরীক্ষা শুরু করুন
              </button>
            </div>
          </div>

         
        </div>

        {/* ===================================================
            STUDY CONTENT
        =================================================== */}

        {hasBullets && (
          <section className="mb-8 rounded-xl border bg-card p-6 md:p-8">
            {/* Header */}

            <p className="mt-1 text-sm text-muted-foreground pb-5">
              এই টপিকের গুরুত্বপূর্ণ তথ্যগুলো ভালোভাবে পড়ে নিন।
            </p>

            <ul className="grid items-stretch space-y-1 gap-x-16 md:grid-cols-2">
              {content.bullets.map((bullet, index) => (
                <li
                  key={`${index}-${bullet.slice(0, 20)}`}
                  className="flex items-start gap-x-3"
                >
                  {/* Bullet */}

                  <span className="text-lg font-bold text-primary">•</span>

                  {/* Text */}

                  <p className="text-sm leading-7 text-foreground">
                    <MarkdownText text={bullet} />
                  </p>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* ===================================================
            USER NO CONTENT
        =================================================== */}

        {!isAdmin && !hasContent && (
          <div className="mb-8 rounded-xl border border-dashed p-6 text-center">
            <FileText className="mx-auto h-8 w-8 text-muted-foreground" />

            <h2 className="mt-3 font-semibold">কোনো Study Content নেই</h2>

            <p className="mt-1 text-sm text-muted-foreground">
              এই টপিকের জন্য এখনো কোনো প্রকাশিত study content যোগ করা হয়নি।
            </p>
          </div>
        )}

        {/* ===================================================
            QUESTIONS
        =================================================== */}

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

   
      {isAdmin && (
        <TopicContentDialog
          key={content?._id ?? "new"}
          topicId={topicId}
          topicTitle={topic.title}
          content={content}
          open={contentDialogOpen}
          onOpenChange={setContentDialogOpen}
        />
      )}
    </main>
  )
}
