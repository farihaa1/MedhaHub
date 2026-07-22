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

interface Props {
  chapter: AcademicChapter
}

export default function ChapterAccordion({ chapter }: Props) {
  const topics = chapter.topics ?? []

  return (
    <AccordionItem
      value={chapter._id}
      className="rounded-lg border-none"
    >
      {/* ================= HEADER ================= */}
      <div className="flex items-center justify-between gap-4 px-5 py-4">
        {/* Left */}
        <AccordionTrigger className="flex-1  py-0 hover:no-underline">
          <div className="flex items-center gap-3 text-left">
            <FolderOpen className="h-5 w-5 text-primary" />

            <div>
              <h3 className="font-semibold">{chapter.title}</h3>
            </div>
          </div>
        </AccordionTrigger>

        {/* Right */}
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

          <CreateTopicDialog>
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

      {/* ================= TOPICS ================= */}
      <AccordionContent className="overflow-n z-50 space-y-3 border-none ">
        {topics.length === 0 ? (
          <div className="rounded-lg border border-dashed py-8 text-center text-sm text-muted-foreground">
            No topics found.
          </div>
        ) : (
          topics.map((topic) => <TopicCard key={topic._id} topic={topic} />)
        )}
      </AccordionContent>
    </AccordionItem>
  )
}
