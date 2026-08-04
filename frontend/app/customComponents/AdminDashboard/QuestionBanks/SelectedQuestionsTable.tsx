"use client"

import { Loader2, Trash2 } from "lucide-react"
import { toast } from "sonner"
import { FetchBaseQueryError } from "@reduxjs/toolkit/query"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { Input } from "@/components/ui/input"

import { IQuestionBankQuestion } from "@/app/redux/types/questionBank.types"

import {
  useRemoveQuestionFromBankMutation,
  useUpdateQuestionBankItemMutation,
} from "@/app/redux/api/questionBankItemApi"

interface SelectedQuestionsTableProps {
  loading: boolean
  data: IQuestionBankQuestion[]
  bankId: string
  onRefresh: () => void
}

export default function SelectedQuestionsTable({
  loading,
  data,
  bankId,
  onRefresh,
}: SelectedQuestionsTableProps) {
  const [removeQuestion, { isLoading: removing }] =
    useRemoveQuestionFromBankMutation()

  const [updateItem] = useUpdateQuestionBankItemMutation()

  const handleRemove = async (questionId: string) => {
    try {
      await removeQuestion({
        questionBankId: bankId,
        questionId,
      }).unwrap()

      toast.success("Question removed successfully.")

      onRefresh()
    } catch (error) {
      const err = error as FetchBaseQueryError & {
        data?: {
          message?: string
        }
      }

      toast.error(err.data?.message ?? "Failed to add questions.")
    }
  }

  const handleUpdate = async (
    id: string,
    field: "order" | "marks" | "negativeMarks",
    value: number
  ) => {
    try {
      await updateItem({
        id,
        data: {
          [field]: value,
        },
      }).unwrap()

      toast.success("Updated.")

      onRefresh()
    } catch {
      toast.error("Update failed.")
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-10">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    )
  }

  if (data.length === 0) {
    return (
      <div className="rounded-lg border border-dashed py-10 text-center text-muted-foreground">
        No questions added yet.
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col">
      {loading ? (
        <div className="flex flex-1 items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
      ) : data.length === 0 ? (
        <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed text-muted-foreground">
          No questions added yet.
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto rounded-lg border">
          <div className="divide-y">
            {data.map((item) => (
              <div
                key={item._id}
                className="space-y-4 p-4 transition hover:bg-muted/30"
              >
                {/* Question */}
                <div>
                  <p className="line-clamp-2 text-sm leading-6 font-semibold">
                    {item.question.questionText}
                  </p>

                  <p className="mt-1 text-xs text-muted-foreground">
                    {item.question.subjectId.title}
                  </p>
                </div>

                {/* Settings */}
                <div className="flex flex-wrap items-end gap-4">
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Order</p>

                    <Input
                      type="number"
                      defaultValue={item.order}
                      className="w-20"
                      onBlur={(e) =>
                        handleUpdate(item._id, "order", Number(e.target.value))
                      }
                    />
                  </div>

                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Marks</p>

                    <Input
                      type="number"
                      defaultValue={item.marks}
                      className="w-20"
                      onBlur={(e) =>
                        handleUpdate(item._id, "marks", Number(e.target.value))
                      }
                    />
                  </div>

                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Negative</p>

                    <Input
                      type="number"
                      step="0.25"
                      defaultValue={item.negativeMarks}
                      className="w-20"
                      onBlur={(e) =>
                        handleUpdate(
                          item._id,
                          "negativeMarks",
                          Number(e.target.value)
                        )
                      }
                    />
                  </div>

                  <div className="ml-auto">
                    <Button
                      size="icon"
                      variant="destructive"
                      disabled={removing}
                      onClick={() => handleRemove(item.question._id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
