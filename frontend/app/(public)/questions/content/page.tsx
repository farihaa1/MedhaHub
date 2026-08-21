"use client"

import { use } from "react"
import { ArrowLeft, BookOpen, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"

import { useGetPublishedTopicContentQuery } from "@/app/redux/api/topicContentApi"
import { useGetTopicQuery } from "@/app/redux/api/topicsApi"

interface PageProps {
  params: Promise<{
    topicId: string
  }>
}

/**
 * Converts **text** into bold React elements.
 *
 * Example:
 *
 * "**চর্যাপদ** বাংলা সাহিত্যের **প্রাচীন যুগের**"
 *
 * becomes:
 *
 * <strong>চর্যাপদ</strong> বাংলা সাহিত্যের <strong>প্রাচীন যুগের</strong>
 */
function renderBoldText(text: string) {
  const parts = text.split(/(\*\*.*?\*\*)/g)

  return parts.map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={index} className="font-semibold text-foreground">
          {part.slice(2, -2)}
        </strong>
      )
    }

    return <span key={index}>{part}</span>
  })
}

/**
 * Cleans malformed content that may have been created
 * by the previous comma/newline based input system.
 */
function cleanBullet(text: string) {
  if (!text) return ""

  let cleaned = text.trim()

  // Remove accidental surrounding quotation marks
  if (
    (cleaned.startsWith('"') && cleaned.endsWith('"')) ||
    (cleaned.startsWith("'") && cleaned.endsWith("'"))
  ) {
    cleaned = cleaned.slice(1, -1).trim()
  }

  // Remove accidental markdown bullet
  cleaned = cleaned.replace(/^[-•]\s*/, "")

  // Convert multiple spaces/newlines into a single space
  cleaned = cleaned.replace(/\s+/g, " ").trim()

  return cleaned
}

export default function TopicStudyContentPage({ params }: PageProps) {
  const { topicId } = use(params)

  const router = useRouter()

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
  // PUBLISHED CONTENT
  // =========================================================

  const {
    data: contentResponse,
    isLoading: contentLoading,
    isError: contentError,
  } = useGetPublishedTopicContentQuery(topicId, {
    skip: !topicId,
  })

  // =========================================================
  // DATA
  // =========================================================

  const topic = topicResponse?.data

  const content = contentResponse?.data ?? null

  const bullets = content?.bullets ?? []

  // =========================================================
  // LOADING
  // =========================================================

  if (topicLoading || contentLoading) {
    return (
      <main className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-10 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl">
            <div className="flex items-center gap-3">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />

              <p className="text-sm text-muted-foreground">
                Study Content লোড হচ্ছে...
              </p>
            </div>
          </div>
        </div>
      </main>
    )
  }

  // =========================================================
  // ERROR
  // =========================================================

  if (topicError || !topic) {
    return (
      <main className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-10 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl rounded-xl border border-dashed p-10 text-center">
            <BookOpen className="mx-auto h-10 w-10 text-muted-foreground" />

            <h1 className="mt-4 text-xl font-semibold">টপিকটি পাওয়া যায়নি</h1>

            <button
              type="button"
              onClick={() => router.back()}
              className="mt-6 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
            >
              ফিরে যান
            </button>
          </div>
        </div>
      </main>
    )
  }

  // =========================================================
  // NO CONTENT
  // =========================================================

  if (contentError || !content || bullets.length === 0) {
    return (
      <main className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-10 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl">
            <button
              type="button"
              onClick={() => router.back()}
              className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              ফিরে যান
            </button>

            <div className="rounded-xl border border-dashed p-10 text-center">
              <BookOpen className="mx-auto h-10 w-10 text-muted-foreground" />

              <h1 className="mt-4 text-xl font-semibold">
                কোনো Study Content নেই
              </h1>

              <p className="mt-2 text-sm text-muted-foreground">
                এই টপিকের জন্য এখনো কোনো প্রকাশিত study content যোগ করা হয়নি।
              </p>
            </div>
          </div>
        </div>
      </main>
    )
  }

  // =========================================================
  // CLEAN BULLETS
  // =========================================================

  const cleanedBullets = bullets.map(cleanBullet).filter(Boolean)

  // =========================================================
  // PAGE
  // =========================================================

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          {/* BACK BUTTON */}

          <button
            type="button"
            onClick={() => router.back()}
            className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground transition hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            ফিরে যান
          </button>

          {/* =================================================
              HEADER
          ================================================= */}

          <div className="mb-8 rounded-xl border bg-card p-6 sm:p-8">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <BookOpen className="h-6 w-6 text-primary" />
              </div>

              <div>
                <h1 className="text-2xl font-bold sm:text-3xl">
                  {topic.title}
                </h1>

                <p className="mt-2 text-sm text-muted-foreground">
                  Study Content
                </p>
              </div>
            </div>

            <p className="mt-6 text-sm leading-7 text-muted-foreground">
              এই টপিকের গুরুত্বপূর্ণ তথ্যগুলো ভালোভাবে পড়ে নিন।
            </p>

            <div className="mt-4 inline-flex rounded-full bg-muted px-3 py-1.5 text-xs font-medium text-muted-foreground">
              {cleanedBullets.length} bullet points
            </div>
          </div>

          {/* =================================================
              CONTENT
          ================================================= */}

          <section className="rounded-xl border bg-card p-6 sm:p-8">
            <div className="mb-6 flex items-center gap-3 border-b pb-5">
              <div className="h-2 w-2 rounded-full bg-primary" />

              <h2 className="text-lg font-semibold">গুরুত্বপূর্ণ তথ্য</h2>
            </div>

            {/* =================================================
                BULLET LIST
            ================================================= */}

            <ul className="space-y-4">
              {cleanedBullets.map((bullet, index) => (
                <li
                  key={`${index}-${bullet.slice(0, 30)}`}
                  className="relative pl-7 text-[15px] leading-8 text-muted-foreground"
                >
                  {/* CUSTOM BULLET */}

                  <span
                    aria-hidden="true"
                    className="absolute top-[11px] left-1 h-2 w-2 rounded-full bg-primary"
                  />

                  {/* TEXT */}

                  <div>{renderBoldText(bullet)}</div>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </main>
  )
}
