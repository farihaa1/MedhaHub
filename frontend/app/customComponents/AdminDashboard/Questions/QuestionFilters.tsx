"use client"

import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import SearchQuestion from "./SearchQuestion"

import { useGetSubjectsQuery } from "@/app/redux/api/subjectsApi"
import { useGetChaptersBySubjectQuery } from "@/app/redux/api/chaptersApi"
import { useGetTopicsByChapterQuery } from "@/app/redux/api/topicsApi"

interface QuestionFiltersProps {
  search: string
  subjectId: string
  chapterId: string
  topicId: string
  difficulty: string
  type: string
  status: string
  source: string
  sort: string

  onSearchChange: (value: string) => void
  onSubjectChange: (value: string) => void
  onChapterChange: (value: string) => void
  onTopicChange: (value: string) => void
  onDifficultyChange: (value: string) => void
  onTypeChange: (value: string) => void
  onStatusChange: (value: string) => void
  onSourceChange: (value: string) => void
  onSortChange: (value: string) => void

  onClear: () => void
}

export default function QuestionFilters({
  search,
  subjectId,
  chapterId,
  topicId,
  difficulty,
  type,
  status,
  source,
  sort,
  onSearchChange,
  onSubjectChange,
  onChapterChange,
  onTopicChange,
  onDifficultyChange,
  onTypeChange,
  onStatusChange,
  onSourceChange,
  onSortChange,
  onClear,
}: QuestionFiltersProps) {
  const { data: subjectsData } = useGetSubjectsQuery()

  const { data: chaptersData } = useGetChaptersBySubjectQuery(subjectId, {
    skip: subjectId === "all",
  })

  const { data: topicsData } = useGetTopicsByChapterQuery(chapterId, {
    skip: chapterId === "all",
  })

  return (
    <div className="space-y-4 rounded-xl border bg-card p-5 shadow-sm">
      <SearchQuestion
        value={search}
        onChange={onSearchChange}
        placeholder="Search questions..."
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {/* Subject */}
        <Select
          value={subjectId}
          onValueChange={(value) => {
            onSubjectChange(value)
            onChapterChange("all")
            onTopicChange("all")
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Subject" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="all">All Subjects</SelectItem>

            {subjectsData?.data?.map((subject) => (
              <SelectItem key={subject._id} value={subject._id}>
                {subject.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Chapter */}
        <Select
          value={chapterId}
          disabled={subjectId === "all"}
          onValueChange={(value) => {
            onChapterChange(value)
            onTopicChange("all")
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Chapter" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="all">All Chapters</SelectItem>

            {chaptersData?.data?.map((chapter) => (
              <SelectItem key={chapter._id} value={chapter._id}>
                {chapter.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Topic */}
        <Select
          value={topicId}
          disabled={chapterId === "all"}
          onValueChange={onTopicChange}
        >
          <SelectTrigger>
            <SelectValue placeholder="Topic" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="all">All Topics</SelectItem>

            {topicsData?.data?.map((topic) => (
              <SelectItem key={topic._id} value={topic._id}>
                {topic.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Difficulty */}
        <Select value={difficulty} onValueChange={onDifficultyChange}>
          <SelectTrigger>
            <SelectValue placeholder="Difficulty" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="all">All Difficulty</SelectItem>
            <SelectItem value="EASY">Easy</SelectItem>
            <SelectItem value="MEDIUM">Medium</SelectItem>
            <SelectItem value="HARD">Hard</SelectItem>
          </SelectContent>
        </Select>

        {/* Type */}
        <Select value={type} onValueChange={onTypeChange}>
          <SelectTrigger>
            <SelectValue placeholder="Question Type" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="MCQ">MCQ</SelectItem>
          </SelectContent>
        </Select>

        {/* Status */}
        <Select value={status} onValueChange={onStatusChange}>
          <SelectTrigger>
            <SelectValue placeholder="Status" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="PENDING">Pending</SelectItem>
            <SelectItem value="APPROVED">Approved</SelectItem>
            <SelectItem value="REJECTED">Rejected</SelectItem>
          </SelectContent>
        </Select>

        {/* Source */}
        <Select value={source} onValueChange={onSourceChange}>
          <SelectTrigger>
            <SelectValue placeholder="Source" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="all">All Sources</SelectItem>
            <SelectItem value="BCS">BCS</SelectItem>
            <SelectItem value="BANK">Bank</SelectItem>
            <SelectItem value="NTRCA">NTRCA</SelectItem>
            <SelectItem value="PRIMARY">Primary</SelectItem>
            <SelectItem value="UNIVERSITY">University</SelectItem>
            <SelectItem value="MEDICAL">Medical</SelectItem>
            <SelectItem value="CUSTOM">Custom</SelectItem>
          </SelectContent>
        </Select>

        {/* Sort */}
        <Select value={sort} onValueChange={onSortChange}>
          <SelectTrigger>
            <SelectValue placeholder="Sort" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="newest">Newest</SelectItem>
            <SelectItem value="oldest">Oldest</SelectItem>
            <SelectItem value="az">A → Z</SelectItem>
            <SelectItem value="za">Z → A</SelectItem>
          </SelectContent>
        </Select>

        <Button variant="outline" className="w-full" onClick={onClear}>
          Clear Filters
        </Button>
      </div>
    </div>
  )
}
