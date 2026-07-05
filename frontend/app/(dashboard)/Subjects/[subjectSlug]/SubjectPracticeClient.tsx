"use client"

import { useRouter } from "next/navigation"
import { useMemo, useState } from "react"
import SubjectDetailsHero from "@/app/customComponents/SubjectDetails/SubjectDetailsHero"
import ChapterAccordion from "@/app/customComponents/SubjectDetails/Chapters/ChapterAccordion"

import { chapters } from "@/app/data/chaptersData"
import { topics } from "@/app/data/topicsData"

import { color } from "@/app/type"
import { SubjectDetails } from "@/app/subjectDetails"
import SelectedTopicsSummary from "@/app/customComponents/SubjectDetails/Topics/SelectedTopicsSummary"

interface Props {
  subject: SubjectDetails
  subjectSlug: string
  color: color
}

export default function SubjectPracticeClient({
  subject,
  subjectSlug,
  color,
}: Props) {
 
  const router = useRouter()

  // Selected topic ids
  const [selectedTopics, setSelectedTopics] = useState<string[]>([])

  const toggleTopic = (id: string) => {
    setSelectedTopics((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    )
  }

  // Total questions from selected topics
  const selectedQuestions = useMemo<number>(() => {
    return topics
      .filter((topic) => selectedTopics.includes(topic.id))
      .reduce((sum, topic) => sum + topic.totalQuestions, 0)
  }, [selectedTopics])

  return (
    <main className="relative space-y-8 pb-32">
      <SubjectDetailsHero
        title={subject.title}
        description={subject.description || ""}
        totalQuestions={subject.totalQuestions || 0}
        totalChapters={subject.totalChapters || 0}
        totalTopics={subject.totalTopics || 0}
        completedQuestions={1}
        estimatedHours={subject.estimatedHours || 0}
        color={color}
      />

      <ChapterAccordion
        id={subject.id}
        color={color}
        chapters={chapters}
        selectedTopics={selectedTopics}
        onToggleTopic={toggleTopic}
      />

      {selectedTopics.length > 0 && (
        <div className="fixed right-8 bottom-8 z-50">
          <SelectedTopicsSummary
            selectedTopics={selectedTopics.length}
            selectedQuestions={selectedQuestions}
            onGenerate={() => {
              router.push(
                `/practice/configure?topics=${selectedTopics.join(",")}`
              )
            }}
          />
        </div>
      )}
    </main>
  )
}
