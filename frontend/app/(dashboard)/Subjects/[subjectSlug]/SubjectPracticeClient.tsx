"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

import { color } from "@/app/type"

import SubjectDetailsHero from "../subjectComponents/SubjectDetails/SubjectDetailsHero"
import ChapterAccordion from "../subjectComponents/SubjectDetails/Chapters/ChapterAccordion"
import SelectedTopicsSummary from "../subjectComponents/SubjectDetails/Topics/SelectedTopicsSummary"

import { useGetSubjectQuery } from "@/app/redux/api/subjectsApi"
import { useGetChaptersBySubjectQuery } from "@/app/redux/api/chaptersApi"

interface Props {
  subjectSlug: string
  color: color
}

export default function SubjectPracticeClient({ subjectSlug, color }: Props) {
  const router = useRouter()

  // Subject
  const {
    data: subjectResponse,
    isLoading: subjectLoading,
    isError: subjectError,
  } = useGetSubjectQuery(subjectSlug)

  const subject = subjectResponse?.data

  // Chapters
  const {
    data: chaptersResponse,
    isLoading: chaptersLoading,
    isError: chaptersError,
  } = useGetChaptersBySubjectQuery(subject?._id ?? "", {
    skip: !subject?._id,
  })

  const chapters = chaptersResponse?.data ?? []

  // Selected Topics
  const [selectedTopics, setSelectedTopics] = useState<string[]>([])

  const toggleTopic = (topicId: string) => {
    setSelectedTopics((prev) =>
      prev.includes(topicId)
        ? prev.filter((id) => id !== topicId)
        : [...prev, topicId]
    )
  }

  // Loading
  if (subjectLoading || chaptersLoading) {
    return (
      <div className="flex h-64 items-center justify-center">Loading...</div>
    )
  }

  // Error
  if (subjectError || chaptersError || !subject) {
    return (
      <div className="flex h-64 items-center justify-center text-red-500">
        Failed to load subject.
      </div>
    )
  }

  return (
    <main className="relative space-y-8 pb-32">
      <SubjectDetailsHero
        title={subject.title}
        description={subject.description ?? ""}
        totalQuestions={subject.totalQuestions ?? 0}
        totalChapters={subject.totalChapters ?? 0}
        totalTopics={subject.totalTopics ?? 0}
        completedQuestions={subject.completedQuestions ?? 0}
        estimatedHours={subject.estimatedHours ?? 0}
        color={color}
      />

      <ChapterAccordion
        chapters={chapters}
        color={color}
        selectedTopics={selectedTopics}
        onToggleTopic={toggleTopic}
      />

      {selectedTopics.length > 0 && (
        <div className="fixed right-8 bottom-8 z-50">
          <SelectedTopicsSummary
            selectedTopics={selectedTopics.length}
            selectedQuestions={0} // Calculate later when topics are fetched inside ChapterAccordion
            onGenerate={() => {
              router.push(
                `/subjects/${subjectSlug}/configure?topics=${selectedTopics.join(",")}`
              )
            }}
          />
        </div>
      )}
    </main>
  )
}
