"use client"

import { RotateCcw, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

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
  /* Search */
  search: string
  setSearch: (value: string) => void

  sourceTitle: string
  setSourceTitle: (value: string) => void

  /* Academic */
  subjectId: string
  setSubjectId: (value: string) => void

  chapterId: string
  setChapterId: (value: string) => void

  topicId: string
  setTopicId: (value: string) => void

  /* Metadata */
  difficulty: string
  setDifficulty: (value: string) => void

  status: string
  setStatus: (value: string) => void

  type: string
  setType: (value: string) => void

  source: string
  setSource: (value: string) => void

  /* Sorting */
  sort: string
  setSort: (value: string) => void

  setPage: (value: number) => void
}

export default function QuestionFilters({
  search,
  setSearch,

  sourceTitle,
  setSourceTitle,

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
  /* ============================================================
     SUBJECTS
  ============================================================ */

  const { data: subjectData } = useGetSubjectsQuery()

  /* ============================================================
     CHAPTERS
  ============================================================ */

  const { data: chapterData, isLoading: chapterLoading } =
    useGetChaptersBySubjectQuery(subjectId, {
      skip: !subjectId,
    })

  /* ============================================================
     TOPICS
  ============================================================ */

  const { data: topicData, isLoading: topicLoading } =
    useGetTopicsByChapterQuery(chapterId, {
      skip: !chapterId,
    })

  /* ============================================================
     RESET PAGE
  ============================================================ */

  const resetPage = () => {
    setPage(1)
  }

  /* ============================================================
     RESET ALL FILTERS
  ============================================================ */

  const resetFilters = () => {
    setSearch("")
    setSourceTitle("")

    setSubjectId("")
    setChapterId("")
    setTopicId("")

    setDifficulty("")
    setStatus("")
    setType("")
    setSource("")

    setSort("-createdAt")

    setPage(1)
  }

  return (
    <div className="rounded-lg border bg-background p-4">
      {/* ======================================================
          SEARCHES
      ====================================================== */}

      <div className="mb-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* QUESTION SEARCH */}

        <div className="relative">
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

          <Input
            value={search}
            onChange={(event) => {
              setSearch(event.target.value)
              resetPage()
            }}
            placeholder="Search question..."
            className="pl-9"
          />
        </div>

        {/* SOURCE TITLE SEARCH */}

        <div className="relative">
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

          <Input
            value={sourceTitle}
            onChange={(event) => {
              setSourceTitle(event.target.value)
              resetPage()
            }}
            placeholder="Search source title..."
            className="pl-9"
          />
        </div>
      </div>

      {/* ======================================================
          FILTERS
      ====================================================== */}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {/* SUBJECT */}

        <Select
          value={subjectId || "all"}
          onValueChange={(value) => {
            const newSubjectId = value === "all" ? "" : value

            setSubjectId(newSubjectId)

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

        {/* CHAPTER */}

        <Select
          disabled={!subjectId || chapterLoading}
          value={chapterId || "all"}
          onValueChange={(value) => {
            const newChapterId = value === "all" ? "" : value

            setChapterId(newChapterId)
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

        {/* TOPIC */}

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

        {/* DIFFICULTY */}

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

            {Object.values(QuestionDifficulty).map((item) => (
              <SelectItem key={item} value={item}>
                {item}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* STATUS */}

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

            {Object.values(QuestionStatus).map((item) => (
              <SelectItem key={item} value={item}>
                {item}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* TYPE */}

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

            {Object.values(QuestionType).map((item) => (
              <SelectItem key={item} value={item}>
                {item}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* SOURCE TYPE */}

        <Select
          value={source || "all"}
          onValueChange={(value) => {
            setSource(value === "all" ? "" : value)

            resetPage()
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Source Type" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="all">All Sources</SelectItem>

            {Object.values(QuestionSourceType).map((item) => (
              <SelectItem key={item} value={item}>
                {item}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* SORT */}

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

      {/* ======================================================
          FOOTER
      ====================================================== */}

      <div className="mt-6 flex items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground">
          Filter questions by academic, source, search, and metadata fields.
        </p>

        <Button variant="outline" onClick={resetFilters}>
          <RotateCcw className="mr-2 h-4 w-4" />
          Reset Filters
        </Button>
      </div>
    </div>
  )
}
