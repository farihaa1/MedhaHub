"use client"

import { Search, X } from "lucide-react"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { useGetSubjectsQuery } from "@/app/redux/api/subjectsApi"
import { useGetChaptersQuery } from "@/app/redux/api/chaptersApi"

interface Props {
  search: string
  subjectId: string
  chapterId: string
  status: string
  sort: string

  onSearchChange: (value: string) => void
  onSubjectChange: (value: string) => void
  onChapterChange: (value: string) => void
  onStatusChange: (value: string) => void
  onSortChange: (value: string) => void
  onClear: () => void
}

export default function AcademicFilters({
  search,
  subjectId,
  chapterId,
  status,
  sort,
  onSearchChange,
  onSubjectChange,
  onChapterChange,
  onStatusChange,
  onSortChange,
  onClear,
}: Props) {
  const { data: subjects } = useGetSubjectsQuery()

  const { data: chapters } = useGetChaptersQuery()

  return (
    <div className="rounded-xl border bg-card p-4">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-6">
        {/* Search */}

        <div className="relative xl:col-span-2">
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

          <Input
            value={search}
            placeholder="Search chapter or topic..."

            className="pl-9"

            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        {/* Subject */}

        <Select value={subjectId} onValueChange={onSubjectChange}>
          <SelectTrigger>
            <SelectValue placeholder="Subject" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="all">All Subjects</SelectItem>

            {subjects?.data?.map((subject) => (
              <SelectItem key={subject._id} value={subject._id}>
                {subject.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Chapter */}

        <Select value={chapterId} onValueChange={onChapterChange}>
          <SelectTrigger>
            <SelectValue placeholder="Chapter" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="all">All Chapters</SelectItem>

            {chapters?.data?.map((chapter) => (
              <SelectItem key={chapter._id} value={chapter._id}>
                {chapter.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Status */}

        <Select value={status} onValueChange={onStatusChange}>
          <SelectTrigger>
            <SelectValue placeholder="Status" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="all">All</SelectItem>

            <SelectItem value="APPROVED">Approved</SelectItem>

            <SelectItem value="DRAFT">Draft</SelectItem>

            <SelectItem value="ARCHIVED">Archived</SelectItem>
          </SelectContent>
        </Select>

        {/* Sort */}

        <Select value={sort} onValueChange={onSortChange}>
          <SelectTrigger>
            <SelectValue placeholder="Sort By" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="newest">Newest</SelectItem>

            <SelectItem value="oldest">Oldest</SelectItem>

            <SelectItem value="az">A → Z</SelectItem>

            <SelectItem value="za">Z → A</SelectItem>

            <SelectItem value="questions">Most Questions</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="mt-4 flex justify-end">
        <Button variant="outline" onClick={onClear}>
          <X className="mr-2 h-4 w-4" />
          Clear Filters
        </Button>
      </div>
    </div>
  )
}
