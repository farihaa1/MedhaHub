"use client"

import { useState } from "react"

import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react"

import {
  IEntityValue,
  IQuestion,
  QuestionStatus,
  useGetQuestionsQuery,
} from "@/app/redux/api/questionsApi"

import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"

interface Props {
  search?: string
  subjectId?: string
  chapterId?: string
  status?: string
  sort?: string

  onSelect: (ids: string[]) => void
}

export default function QuestionSelectorTable({
  search = "",
  subjectId = "all",
  chapterId = "all",
  status = "all",
  sort = "newest",
  onSelect,
}: Props) {
  const [page, setPage] = useState(1)

  const [selected, setSelected] = useState<string[]>([])

  /* ==========================================================
     STATUS
  ========================================================== */

  const questionStatus: QuestionStatus | undefined =
    status === "all" ? undefined : (status as QuestionStatus)

  /* ==========================================================
     SORT
     
     AcademicFilters values:
     
     newest
     oldest
     az
     za
     
     Question API expects:
     
     sortBy
     sortOrder
  ========================================================== */

  const getSortParams = () => {
    switch (sort) {
      case "oldest":
        return {
          sortBy: "createdAt",
          sortOrder: "asc" as const,
        }

      case "az":
        return {
          sortBy: "questionText",
          sortOrder: "asc" as const,
        }

      case "za":
        return {
          sortBy: "questionText",
          sortOrder: "desc" as const,
        }

      case "newest":
      default:
        return {
          sortBy: "createdAt",
          sortOrder: "desc" as const,
        }
    }
  }

  const { sortBy, sortOrder } = getSortParams()

  /* ==========================================================
     GET QUESTIONS
  ========================================================== */

  const { data, isLoading, isFetching } = useGetQuestionsQuery({
    page,
    limit: 10,

    searchTerm: search.trim() || undefined,

    subjectId: subjectId === "all" ? undefined : subjectId,

    chapterId: chapterId === "all" ? undefined : chapterId,

    status: questionStatus,

    sortBy,
    sortOrder,
  })

  /* ==========================================================
     RESPONSE DATA
  ========================================================== */

  const questions = data?.data?.data ?? []

  const totalPage = data?.data?.meta?.totalPage ?? 1

  /* ==========================================================
     ENTITY TITLE
  ========================================================== */

  const getTitle = (value: IEntityValue) => {
    if (!value) {
      return "-"
    }

    if (typeof value === "string") {
      return value
    }

    return value.title
  }

  /* ==========================================================
     SELECT QUESTION
  ========================================================== */

  const toggleSelect = (id: string) => {
    let updated: string[]

    if (selected.includes(id)) {
      updated = selected.filter((item) => item !== id)
    } else {
      updated = [...selected, id]
    }

    setSelected(updated)

    onSelect(updated)
  }

  /* ==========================================================
     CLEAR SELECTION
  ========================================================== */

  const clearSelection = () => {
    setSelected([])
    onSelect([])
  }

  /* ==========================================================
     RENDER
  ========================================================== */

  return (
    <div className="flex flex-col">
      {/* ======================================================
          TOP INFO
      ====================================================== */}

      <div className="mb-3 flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          {isFetching && !isLoading ? (
            <span className="flex items-center gap-2">
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              Updating questions...
            </span>
          ) : (
            <>{questions.length} questions</>
          )}
        </div>

        {selected.length > 0 && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={clearSelection}
          >
            Clear selection
          </Button>
        )}
      </div>

      {/* ======================================================
          QUESTION LIST
      ====================================================== */}

      <div className="max-h-125 overflow-y-auto rounded-lg border">
        {isLoading ? (
          <div className="flex h-52 items-center justify-center">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin" />
              Loading questions...
            </div>
          </div>
        ) : questions.length === 0 ? (
          <div className="flex h-52 items-center justify-center text-muted-foreground">
            No questions found.
          </div>
        ) : (
          <div className="divide-y">
            {questions.map((item: IQuestion) => (
              <label
                key={item._id}
                className="flex cursor-pointer items-start gap-3 p-4 transition hover:bg-muted/40"
              >
                {/* Checkbox */}

                <Checkbox
                  checked={selected.includes(item._id)}
                  onCheckedChange={() => toggleSelect(item._id)}
                />

                {/* Question */}

                <div className="min-w-0 flex-1">
                  <p className="line-clamp-2 leading-6 font-medium wrap-break-word">
                    {item.questionText}
                  </p>

                  {/* Academic information */}

                  <div className="mt-1 flex flex-wrap gap-x-2 gap-y-1 text-xs text-muted-foreground">
                    <span>{getTitle(item.subjectId)}</span>

                    <span>•</span>

                    <span>{getTitle(item.chapterId)}</span>

                    {item.difficulty && (
                      <>
                        <span>•</span>

                        <span>{item.difficulty}</span>
                      </>
                    )}

                    <span>•</span>

                    <span>{item.status}</span>
                  </div>
                </div>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* ======================================================
          PAGINATION
      ====================================================== */}

      <div className="mt-4 flex items-center justify-between">
        {/* Previous */}

        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={page === 1 || isFetching}
          onClick={() => setPage((current) => current - 1)}
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Previous
        </Button>

        {/* Page */}

        <span className="text-sm text-muted-foreground">
          Page {page} of {totalPage}
        </span>

        {/* Next */}

        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={page >= totalPage || isFetching}
          onClick={() => setPage((current) => current + 1)}
        >
          Next
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
