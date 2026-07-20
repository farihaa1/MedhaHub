"use client"

import { useState } from "react"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { Checkbox } from "@/components/ui/checkbox"

import { Input } from "@/components/ui/input"

import { Button } from "@/components/ui/button"
import { IQuestion, useGetQuestionsQuery } from "@/app/redux/api/questionsApi"

interface Props {
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
  const questions = data?.data ?? []
  console.log(questions)

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

  if (isLoading) {
    return <p>Loading...</p>
  }

  return (
    <div className="space-y-4">
      <Input
        placeholder="Search questions..."

        value={search}

        onChange={(e) => {
          setSearch(e.target.value)

          setPage(1)
        }}
      />

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Select</TableHead>

              <TableHead>Question</TableHead>

              <TableHead>Subject</TableHead>

              <TableHead>Chapter</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {questions.map((item: IQuestion) => (
              <TableRow key={item._id}>
                <TableCell>
                  <Checkbox
                    checked={selected.includes(item._id)}
                    onCheckedChange={() => toggleSelect(item._id)}
                  />
                </TableCell>

                <TableCell className="max-w-xl">{item.questionText}</TableCell>

                <TableCell>{item.subjectId}</TableCell>

                <TableCell>{item.chapterId}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex justify-between">
        <Button
          variant="outline"

          disabled={page === 1}

          onClick={() => setPage(page - 1)}
        >
          Previous
        </Button>

        <p>Page {page}</p>

        {/* <Button
          variant="outline"

          disabled={
            !data?.data?.meta?.totalPage || page >= data.data.meta.totalPage
          }

          onClick={() => setPage(page + 1)}
        >
          Next
        </Button> */}
      </div>
    </div>
  )
}
