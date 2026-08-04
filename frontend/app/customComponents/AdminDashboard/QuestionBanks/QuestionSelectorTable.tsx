"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react"

import {
  IEntityValue,
  IQuestion,
  useGetQuestionsQuery,
} from "@/app/redux/api/questionsApi"

import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface Props {
  bankId: string
  onSelect: (ids: string[]) => void
}

export default function QuestionSelectorTable({ onSelect }: Props) {
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)
  const [selected, setSelected] = useState<string[]>([])

  const { data, isLoading } = useGetQuestionsQuery({
    page,
    limit: 10,
    searchTerm: search,
  })

  const questions = data?.data.data ?? []
  const totalPage = data?.data.meta.totalPage ?? 1

  const getTitle = (value: IEntityValue) => {
    if (!value) return "-"

    if (typeof value === "string") return value

    return value.title
  }

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

  return (
    <div className="flex h-full flex-col">
      {/* Search */}

      <div className="pb-4">
        <Input
          placeholder="Search questions..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value)
            setPage(1)
          }}
        />
      </div>

      {/* Question List */}

      <div className="flex-1 overflow-y-auto rounded-lg border">
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
                  <p className="line-clamp-2 leading-6 font-medium break-words">
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

      {/* Pagination */}

      <div className="mt-4 flex items-center justify-between">
        <Button
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
