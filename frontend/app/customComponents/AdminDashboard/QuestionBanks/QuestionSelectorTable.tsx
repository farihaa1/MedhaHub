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
  search: string
  subjectId: string
  chapterId: string
  status: string
  sort: string
  onSelect: (ids: string[]) => void
}

export default function QuestionSelectorTable({
  search,
  subjectId,
  chapterId,
  status,
  sort,
  onSelect,
}: Props) {
  const [page, setPage] = useState(1)

  const [selected, setSelected] = useState<string[]>([])

  /* ==========================================================
     STATUS CONVERSION
  ========================================================== */

  const questionStatus: QuestionStatus | undefined =
    status === "all" ? undefined : (status as QuestionStatus)

  /* ==========================================================
     QUESTIONS
  ========================================================== */

  const { data, isLoading } = useGetQuestionsQuery({
    page,
    limit: 10,

    searchTerm: search || undefined,

    subjectId: subjectId === "all" ? undefined : subjectId,

    chapterId: chapterId === "all" ? undefined : chapterId,

    status: questionStatus,
  })

  /* ==========================================================
     DATA
  ========================================================== */

  const questions = data?.data?.data ?? []

  const totalPage = data?.data?.meta?.totalPage ?? 1

  /* ==========================================================
     TITLE HELPER
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
     SELECT / UNSELECT
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
     FILTER CHANGE
     
     We don't use useEffect here because your ESLint config
     rejects synchronous setState calls inside effects.
     
     Instead, the page can be reset by using a key/remount
     approach from the parent if needed.
  ========================================================== */

  return (
    <div className="flex flex-col">
      {/* ======================================================
          ACTIVE FILTER INFO
      ====================================================== */}

      <div className="mb-3 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
        {subjectId !== "all" && (
          <span className="rounded-md border px-2 py-1">Subject filtered</span>
        )}

        {chapterId !== "all" && (
          <span className="rounded-md border px-2 py-1">Chapter filtered</span>
        )}

        {status !== "all" && (
          <span className="rounded-md border px-2 py-1">Status filtered</span>
        )}

        {sort !== "newest" && (
          <span className="rounded-md border px-2 py-1">Sort: {sort}</span>
        )}
      </div>

      {/* ======================================================
          QUESTION LIST
      ====================================================== */}

      <div className="max-h-125 overflow-y-auto rounded-lg border">
        {isLoading ? (
          <div className="flex h-52 items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin" />
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
                <Checkbox
                  checked={selected.includes(item._id)}
                  onCheckedChange={() => toggleSelect(item._id)}
                />

                <div className="min-w-0 flex-1">
                  <p className="line-clamp-2 leading-6 font-medium wrap-break-word">
                    {item.questionText}
                  </p>

                  <p className="mt-1 text-xs text-muted-foreground">
                    {getTitle(item.subjectId)}

                    {" • "}

                    {getTitle(item.chapterId)}
                  </p>
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
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={page === 1}
          onClick={() => setPage((p) => p - 1)}
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Previous
        </Button>

        <span className="text-sm text-muted-foreground">
          Page {page} of {totalPage}
        </span>

        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={page >= totalPage}
          onClick={() => setPage((p) => p + 1)}
        >
          Next
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
