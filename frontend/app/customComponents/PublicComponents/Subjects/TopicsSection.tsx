"use client"

import { useGetTopicsByChapterQuery } from "@/app/redux/api/topicsApi"

import TopicCard from "./TopicCard"

interface TopicsSectionProps {
  subjectSlug: string
  chapterId: string
}

export default function TopicsSection({
  subjectSlug,
  chapterId,
}: TopicsSectionProps) {
  console.log("TOPICS SECTION:", {
    subjectSlug,
    chapterId,
  })

  const {
    data: topicsResponse,
    isLoading,
    isError,
  } = useGetTopicsByChapterQuery(chapterId, {
    skip: !chapterId,
  })

  console.log("TOPICS RESPONSE:", topicsResponse)

  if (!chapterId) {
    return (
      <section className="container mx-auto px-4 py-12">
        <p>Chapter ID is missing.</p>
      </section>
    )
  }

  if (isLoading) {
    return (
      <section className="container mx-auto px-4 py-12">
        <p>Loading topics...</p>
      </section>
    )
  }

  if (isError) {
    return (
      <section className="container mx-auto px-4 py-12">
        <p>Failed to load topics.</p>
      </section>
    )
  }

  const topics = topicsResponse?.data ?? []

  return (
    <section className="container mx-auto px-4 py-12">
      {/* Header */}
      <div className="mb-8">
        <p className="text-sm font-medium text-primary">Chapter Topics</p>

        <h1 className="mt-1 text-2xl font-bold sm:text-3xl">Topics</h1>

        <p className="mt-2 text-muted-foreground">
          Select a topic to practice questions.
        </p>
      </div>

      {/* Empty */}
      {topics.length === 0 ? (
        <div className="rounded-xl border border-dashed p-10 text-center">
          <h2 className="font-semibold">No topics available</h2>

          <p className="mt-2 text-sm text-muted-foreground">
            This chapter does not have any topics yet.
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
