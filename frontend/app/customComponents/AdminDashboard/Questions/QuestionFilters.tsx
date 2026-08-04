"use client"

import { Dispatch, SetStateAction } from "react"
import { RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useGetSubjectsQuery } from "@/app/redux/api/subjectsApi"
import { useGetChaptersBySubjectQuery } from "@/app/redux/api/chaptersApi"
import { useGetTopicsByChapterQuery } from "@/app/redux/api/topicsApi"
import {
  QuestionDifficulty,
  QuestionStatus,
  QuestionType,
  QuestionSourceType,
} from "@/app/redux/api/questionsApi"

interface ISubject {
  _id: string
  title: string
}

interface IChapter {
  _id: string
  title: string
}

interface ITopic {
  _id: string
  title: string
}

interface Props {
  subjectId: string
  setSubjectId: Dispatch<SetStateAction<string>>

  chapterId: string
  setChapterId: Dispatch<SetStateAction<string>>

  topicId: string
  setTopicId: Dispatch<SetStateAction<string>>

  difficulty: string
  setDifficulty: Dispatch<SetStateAction<string>>

  status: string
  setStatus: Dispatch<SetStateAction<string>>

  type: string
  setType: Dispatch<SetStateAction<string>>

  source: string
  setSource: Dispatch<SetStateAction<string>>

  sort: string
  setSort: Dispatch<SetStateAction<string>>

  // pagination
  setPage: Dispatch<SetStateAction<number>>
}

export default function QuestionFilters({
  subjectId,
  setSubjectId,

  chapterId,
  setChapterId,

  topicId,
  setTopicId,

  difficulty,
  setDifficulty,

  status,
  setStatus,

  type,
  setType,

  source,
  setSource,

  sort,
  setSort,

  setPage,
}: Props) {
  const { data: subjectData } = useGetSubjectsQuery()

  const { data: chapterData, isLoading: chapterLoading } =
    useGetChaptersBySubjectQuery(subjectId, {
      skip: !subjectId,
    })

  const { data: topicData, isLoading: topicLoading } =
    useGetTopicsByChapterQuery(chapterId, {
      skip: !chapterId,
    })

  const resetFilters = () => {
    setSubjectId("")
    setChapterId("")
    setTopicId("")

    setDifficulty("")
    setStatus("")
    setType("")
    setSource("")

    setSort("-createdAt")

    // important
    setPage(1)
  }

  const resetPage = () => {
    setPage(1)
  }

  return (
    <div className="rounded-lg border bg-background p-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {/* Subject */}

        <Select
          value={subjectId || "all"}

          onValueChange={(value) => {
            setSubjectId(value === "all" ? "" : value)

            setChapterId("")
            setTopicId("")

            resetPage()
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Subject" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="all">All Subjects</SelectItem>

            {subjectData?.data?.map((subject: ISubject) => (
              <SelectItem key={subject._id} value={subject._id}>
                {subject.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Chapter */}

        <Select
          disabled={!subjectId || chapterLoading}

          value={chapterId || "all"}

          onValueChange={(value) => {
            setChapterId(value === "all" ? "" : value)

            setTopicId("")

            resetPage()
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Chapter" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="all">All Chapters</SelectItem>

            {chapterData?.data?.map((chapter: IChapter) => (
              <SelectItem key={chapter._id} value={chapter._id}>
                {chapter.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Topic */}

        <Select
          disabled={!chapterId || topicLoading}

          value={topicId || "all"}

          onValueChange={(value) => {
            setTopicId(value === "all" ? "" : value)

            resetPage()
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Topic" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="all">All Topics</SelectItem>

            {topicData?.data?.map((topic: ITopic) => (
              <SelectItem key={topic._id} value={topic._id}>
                {topic.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Difficulty */}

        <Select
          value={difficulty || "all"}

          onValueChange={(value) => {
            setDifficulty(value === "all" ? "" : value)

            resetPage()
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Difficulty" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="all">All Difficulties</SelectItem>

            {(Object.values(QuestionDifficulty) as string[]).map((item) => (
              <SelectItem key={item} value={item}>
                {item}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Status */}

        <Select
          value={status || "all"}

          onValueChange={(value) => {
            setStatus(value === "all" ? "" : value)

            resetPage()
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Status" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>

            {(Object.values(QuestionStatus) as string[]).map((item) => (
              <SelectItem key={item} value={item}>
                {item}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Type */}

        <Select
          value={type || "all"}

          onValueChange={(value) => {
            setType(value === "all" ? "" : value)

            resetPage()
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Type" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>

            {(Object.values(QuestionType) as string[]).map((item) => (
              <SelectItem key={item} value={item}>
                {item}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Source */}

        <Select
          value={source || "all"}

          onValueChange={(value) => {
            setSource(value === "all" ? "" : value)

            resetPage()
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Source" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="all">All Sources</SelectItem>
            {(Object.values(QuestionSourceType) as string[]).map((item) => (
              <SelectItem key={item} value={item}>
                {item}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Sort */}

        <Select
          value={sort}

          onValueChange={(value) => {
            setSort(value)

            resetPage()
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Sort" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="-createdAt">Newest First</SelectItem>

            <SelectItem value="createdAt">Oldest First</SelectItem>

            <SelectItem value="marks">Marks Low → High</SelectItem>

            <SelectItem value="-marks">Marks High → Low</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="mt-6 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Filter questions by academic and metadata fields.
        </p>

        <Button variant="outline" onClick={resetFilters}>
          <RotateCcw className="mr-2 h-4 w-4" />
          Reset Filters
        </Button>
      </div>
    </div>
  )
}
