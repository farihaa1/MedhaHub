"use client"

import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

import { FolderOpen, MoreHorizontal, Pencil, Plus, Trash2 } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import EditChapterDialog from "./EditChapterDialog"
import DeleteChapterDialog from "./DeleteChapterDialog"
import CreateTopicDialog from "./CreateTopicDialog"
import TopicCard from "./TopicCard"

import { AcademicChapter } from "./AcademicTree"
import { ITopic, useGetTopicsByChapterQuery } from "@/app/redux/api/topicsApi"
import { FetchBaseQueryError } from "@reduxjs/toolkit/query"

interface Props {
  chapter: AcademicChapter
}

export default function ChapterAccordion({ chapter }: Props) {
  const { data, isLoading, isFetching, isError, error, refetch } =
    useGetTopicsByChapterQuery(chapter._id)

  const topics = data?.data ?? []
  const isFetchBaseQueryError = (
    error: unknown
  ): error is FetchBaseQueryError => {
    return typeof error === "object" && error !== null && "status" in error
  }

  return (
    <AccordionItem value={chapter._id} className="rounded-lg">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 px-5 py-4">
        <AccordionTrigger className="flex-1 py-0 hover:no-underline">
          <div className="flex items-center gap-3 text-left">
            <FolderOpen className="h-5 w-5 text-primary" />

            <div>
              <h3 className="font-semibold text-[13px]">{chapter.title}</h3>
            </div>
          </div>
        </AccordionTrigger>

        <div
          className="flex shrink-0 items-center gap-2"
          onClick={(e) => e.stopPropagation()}
        >
          <Badge variant="secondary" className="text-[10px]">
            {topics.length} Topics
          </Badge>

          <Badge className="text-[10px]">
            {chapter.totalQuestions ?? 0} Questions
          </Badge>

          <CreateTopicDialog chapter={chapter}>
            <Button size="xs" className="gap-1 text-[10px]">
              <Plus className="h-4 w-4" />
              Topic
            </Button>
          </CreateTopicDialog>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
              <EditChapterDialog chapter={chapter}>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit Chapter
                </DropdownMenuItem>
              </EditChapterDialog>

              <DropdownMenuSeparator />

              <DeleteChapterDialog chapter={chapter}>
                <DropdownMenuItem
                  className="text-destructive"
                  onSelect={(e) => e.preventDefault()}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Chapter
                </DropdownMenuItem>
              </DeleteChapterDialog>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Topics */}
      <AccordionContent className="space-y-3 pb-10">
        {(isLoading || isFetching) && (
          <div className="rounded-lg border border-dashed py-8 text-center text-sm text-muted-foreground">
            Loading topics...
          </div>
        )}

        {!isLoading && isError && (
          <div className="rounded-lg border border-dashed py-8 text-center">
            <p className="text-sm text-destructive">Failed to load topics.</p>

            {isFetchBaseQueryError(error) && (
              <p className="mt-1 text-xs text-muted-foreground">
                Error: {String(error.status)}
              </p>
            )}

            <Button
              size="sm"
              variant="outline"
              className="mt-4"
              onClick={() => refetch()}
            >
              Retry
            </Button>
          </div>
        )}

        {!isLoading && !isError && topics.length === 0 && (
          <div className="rounded-lg border border-dashed py-8 text-center text-sm text-muted-foreground">
            No topics found.
          </div>
        )}

        {!isLoading &&
          !isError &&
          topics.length > 0 &&
          topics.map((topic: ITopic) => (
            <TopicCard key={topic._id} topic={topic} />
          ))}
      </AccordionContent>
    </AccordionItem>
  )
}
