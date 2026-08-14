"use client"

import { useGetTopicsByChapterQuery } from "@/app/redux/api/topicsApi"

import TopicCard from "./TopicCard"
import TopicCardSkeleton from "./TopicCardSkeleton"

interface TopicsSectionProps {
  subjectSlug: string
  chapterId: string
}

export default function TopicsSection({
  subjectSlug,
  chapterId,
}: TopicsSectionProps) {
  const {
    data: topicsResponse,
    isLoading,
    isError,
  } = useGetTopicsByChapterQuery(chapterId, {
    skip: !chapterId,
  })

  /*
   * --------------------------------
   * Chapter ID missing
   * --------------------------------
   */

  if (!chapterId) {
    return (
      <section className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="rounded-xl border border-dashed p-10 text-center">
          <h2 className="font-semibold">অধ্যায়টি পাওয়া যায়নি</h2>

          <p className="mt-2 text-sm text-muted-foreground">
            কোন অধ্যায় দেখাতে হবে তা ঠিক করা যায়নি।
          </p>
        </div>
      </section>
    )
  }

  /*
   * --------------------------------
   * Loading
   * --------------------------------
   */

  if (isLoading) {
    return (
      <section className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 space-y-3">
          <SkeletonLine className="h-4 w-32" />

          <SkeletonLine className="h-9 w-48" />

          <SkeletonLine className="h-5 w-full max-w-xl" />
        </div>

        {/* Topic skeletons */}
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <TopicCardSkeleton key={index} />
          ))}
        </div>
      </section>
    )
  }

  /*
   * --------------------------------
   * API error
   * --------------------------------
   */

  if (isError) {
    return (
      <section className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="rounded-xl border border-dashed p-10 text-center">
          <h2 className="font-semibold">টপিকগুলো লোড করা যায়নি</h2>

          <p className="mt-2 text-sm text-muted-foreground">
            একটু পরে আবার চেষ্টা করুন।
          </p>
        </div>
      </section>
    )
  }

  const topics = topicsResponse?.data ?? []

  /*
   * --------------------------------
   * Normal content
   * --------------------------------
   */

  return (
    <section className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <p className="text-sm font-medium text-primary">অধ্যায়ের টপিক</p>

        <h1 className="mt-1 text-2xl font-bold sm:text-3xl">টপিক বেছে নিন</h1>

        <p className="mt-2 text-muted-foreground">
          যেকোনো একটি টপিক বেছে নিয়ে প্রশ্ন প্র্যাকটিস করুন।
        </p>
      </div>

      {/* Empty */}
      {topics.length === 0 ? (
        <div className="rounded-xl border border-dashed p-10 text-center">
          <h2 className="font-semibold">এখনো কোনো টপিক নেই</h2>

          <p className="mt-2 text-sm text-muted-foreground">
            এই অধ্যায়ে এখনো কোনো টপিক যোগ করা হয়নি।
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
          {topics.map((topic) => (
            <TopicCard
              key={topic._id}
              topic={topic}
              subjectSlug={subjectSlug}
            />
          ))}
        </div>
      )}
    </section>
  )
}

/*
 * --------------------------------
 * Small reusable skeleton line
 * --------------------------------
 */

function SkeletonLine({ className }: { className: string }) {
  return <div className={`animate-pulse rounded bg-muted ${className}`} />
}
