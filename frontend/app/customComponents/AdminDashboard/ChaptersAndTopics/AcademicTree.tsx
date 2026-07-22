"use client"

import { useMemo } from "react"

import { ISubject } from "@/app/(dashboard)/subjects/subjects.type"

import { IChapter, useGetChaptersQuery } from "@/app/redux/api/chaptersApi"

import { ITopic, useGetTopicsQuery } from "@/app/redux/api/topicsApi"

import { useGetSubjectsQuery } from "@/app/redux/api/subjectsApi"

import SubjectAccordion from "./SubjectAccordion"
import { Accordion } from "@/components/ui/accordion"

export interface AcademicChapter extends IChapter {
  topics: ITopic[]
}

export interface AcademicSubject extends ISubject {
  chapters: AcademicChapter[]
}

interface Props {
  search: string
  subjectId: string
  chapterId: string
  status: string
  sort: string
}

export default function AcademicTree({
  search,
  subjectId,
  chapterId,
  status,
  sort,
}: Props) {
  const { data: subjectsData, isLoading: loadingSubjects } =
    useGetSubjectsQuery()

  const { data: chaptersData, isLoading: loadingChapters } =
    useGetChaptersQuery()

  const { data: topicsData, isLoading: loadingTopics } = useGetTopicsQuery()

  const academicData = useMemo(() => {
    const subjects = subjectsData?.data ?? []
    const chapters = chaptersData?.data ?? []
    const topics = topicsData?.data ?? []

    const keyword = search.trim().toLowerCase()

    const filteredSubjects: AcademicSubject[] = subjects
      .filter((subject) => {
        if (subjectId === "all") return true
        return subject._id === subjectId
      })
      .map((subject) => {
        const subjectMatched =
          keyword === "" || subject.title.toLowerCase().includes(keyword)

        const subjectChapters: AcademicChapter[] = chapters
          .filter((chapter) => {
            const currentSubjectId =
              typeof chapter.subjectId === "string"
                ? chapter.subjectId
                : chapter.subjectId._id

            if (currentSubjectId !== subject._id) return false

            if (chapterId !== "all" && chapter._id !== chapterId) {
              return false
            }

            if (
              status !== "all" &&
              chapter.status.toLowerCase() !== status.toLowerCase()
            ) {
              return false
            }

            return true
          })
          .map((chapter) => {
            let chapterTopics = topics.filter(
              (topic) => topic.chapterId === chapter._id
            )

            if (keyword && !subjectMatched) {
              const chapterMatched = chapter.title
                .toLowerCase()
                .includes(keyword)

              if (!chapterMatched) {
                chapterTopics = chapterTopics.filter((topic) =>
                  topic.title.toLowerCase().includes(keyword)
                )
              }
            }

            return {
              ...chapter,
              topics: chapterTopics,
            }
          })
          .filter((chapter) => {
            if (!keyword) return true

            if (subjectMatched) return true

            return (
              chapter.title.toLowerCase().includes(keyword) ||
              chapter.topics.length > 0
            )
          })

        return {
          ...subject,
          chapters: subjectChapters,
        }
      })

    switch (sort) {
      case "az":
        filteredSubjects.sort((a, b) => a.title.localeCompare(b.title))
        break

      case "za":
        filteredSubjects.sort((a, b) => b.title.localeCompare(a.title))
        break

      default:
        break
    }

    return filteredSubjects
  }, [
    subjectsData,
    chaptersData,
    topicsData,
    search,
    subjectId,
    chapterId,
    status,
    sort,
  ])

  if (loadingSubjects || loadingChapters || loadingTopics) {
    return (
      <div className="rounded-xl border p-12 text-center text-muted-foreground">
        Loading academic hierarchy...
      </div>
    )
  }

  if (!academicData.length) {
    return (
      <div className="rounded-xl border p-12 text-center text-muted-foreground">
        No subjects found.
      </div>
    )
  }

 return (
   <Accordion type="multiple" className="space-y-3 p-0 m-0">
     {academicData.map((subject) => (
       <SubjectAccordion key={subject._id} subject={subject} />
     ))}
   </Accordion>
 )
}
