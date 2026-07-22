"use client"

import { BookOpen, MoreHorizontal, Pencil, Plus, Trash2 } from "lucide-react"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import CreateChapterDialog from "./CreateChapterDialog"
import ChapterAccordion from "./ChapterAccordion"

import EditSubjectDialog from "../AdminSubjects/EditSubjectDialog"
import DeleteSubjectDialog from "../AdminSubjects/DeleteSubjectDialog"

import { AcademicSubject } from "./AcademicTree"

interface Props {
  subject: AcademicSubject
}

export default function SubjectAccordion({ subject }: Props) {
  const chapters = subject.chapters ?? []

  const totalTopics = chapters.reduce(
    (sum, chapter) => sum + (chapter.topics?.length ?? 0),
    0
  )

  const totalQuestions = chapters.reduce(
    (sum, chapter) => sum + (chapter.totalQuestions ?? 0),
    0
  )

  return (
    <AccordionItem
      value={subject._id}
      className="mx-auto w-full border bg-card p-0 lg:max-w-6xl lg:min-w-5xl lg:px-8"
    >
      {/* ================= HEADER ================= */}
      <div className="flex items-center justify-between gap-3 px-6 py-2">
        {/* Left */}
        <AccordionTrigger className="flex-1 py-0 hover:no-underline">
          <div className="flex items-center gap-4 text-left">
            <BookOpen className="h-6 w-6 text-primary" />

            <div>
              <h2 className="text-[10px] md:text-sm">{subject.title}</h2>
            </div>
          </div>
        </AccordionTrigger>

        {/* Right */}
        <div
          className="flex flex-wrap items-center gap-2"
          onClick={(e) => e.stopPropagation()}
        >
          <Badge variant="secondary" className="text-[8px] lg:text-[10px]">
            {chapters.length} Chapters
          </Badge>

          <Badge variant="secondary" className="text-[8px] lg:text-[10px]">
            {totalTopics} Topics
          </Badge>

          <Badge variant="secondary" className="text-[8px] lg:text-[10px]">
            {totalQuestions} Questions
          </Badge>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="icon" variant="ghost">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent className="max-w-20" align="end">
              <EditSubjectDialog subject={subject}>
                <DropdownMenuItem
                  className="flex items-center justify-center text-[10px]"
                  onSelect={(e) => e.preventDefault()}
                >
                  <Pencil className="h-4 w-4" />
                  Edit Subject
                </DropdownMenuItem>
              </EditSubjectDialog>

              <CreateChapterDialog>
                <DropdownMenuItem
                  className="flex items-center justify-center text-[10px]"
                  onSelect={(e) => e.preventDefault()}
                >
                  <Plus className="h-4 w-4" />
                  Add Chapter
                </DropdownMenuItem>
              </CreateChapterDialog>
              <DropdownMenuSeparator />
              <EditSubjectDialog subject={subject}></EditSubjectDialog>

              <DropdownMenuSeparator />

              <DeleteSubjectDialog subject={subject}>
                <DropdownMenuItem
                  className="flex items-center justify-center text-[10px] text-destructive"
                  onSelect={(e) => e.preventDefault()}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Subject
                </DropdownMenuItem>
              </DeleteSubjectDialog>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* ================= CHAPTERS ================= */}
      <AccordionContent className="px-6 pb-6">
        {chapters.length === 0 ? (
          <div className="rounded-lg border border-dashed py-10 text-center text-sm text-muted-foreground">
            No chapters found for this subject.
          </div>
        ) : (
          <Accordion type="multiple" className="space-y-3">
            {chapters.map((chapter) => (
              <ChapterAccordion key={chapter._id} chapter={chapter} />
            ))}
          </Accordion>
        )}
      </AccordionContent>
    </AccordionItem>
  )
}
