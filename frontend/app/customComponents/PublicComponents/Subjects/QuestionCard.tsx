
"use client"

import { useState } from "react"
import Image from "next/image"

import {
  BookOpen,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Lightbulb,
  Pencil,
  Trash2,
} from "lucide-react"

import { useSelector } from "react-redux"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

import { IQuestion } from "@/app/redux/api/questionsApi"
import { RootState } from "@/app/redux/store"

import EditQuestionDialog from "../../AdminDashboard/Questions/EditQuestionDialog"
import DeleteQuestionDialog from "../../AdminDashboard/Questions/DeleteQuestionDialog"

interface Props {
  question: IQuestion
  index?: number
}

const OPTION_LABELS = ["ক", "খ", "গ", "ঘ"]

export default function QuestionCard({
  question,
  index,
}: Props) {
  const [showAnswer, setShowAnswer] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)

  const user = useSelector(
    (state: RootState) => state.auth.user
  )

  const isAdmin = user?.role === "admin"

  return (
    <article className="overflow-hidden rounded-xl border bg-card">
      {/* Header */}
      <div className="border-b bg-muted/20 px-4 py-3 sm:px-5 sm:py-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            {index !== undefined && (
              <p className="mb-1 text-[10px] font-medium text-muted-foreground sm:text-xs">
                প্রশ্ন {index + 1}
              </p>
            )}

            <p className="truncate text-[10px] leading-4 text-muted-foreground sm:text-xs">
              {typeof question.subjectId === "object"
                ? question.subjectId?.title
                : ""}
              {" > "}
              {typeof question.chapterId === "object"
                ? question.chapterId?.title
                : ""}
              {" > "}
              {typeof question.topicId === "object"
                ? question.topicId?.title
                : ""}
            </p>
          </div>

          {/* Admin Actions */}
          {isAdmin && (
            <div className="flex shrink-0 items-center gap-1.5">
              <Button
                variant="outline"
                size="sm"
                className="h-8 px-2 text-[10px] sm:px-3 sm:text-xs"
                onClick={() => setEditOpen(true)}
              >
                <Pencil className="mr-1 h-3 w-3 sm:h-3.5 sm:w-3.5" />
                সম্পাদনা
              </Button>

              <Button
                variant="destructive"
                size="sm"
                className="h-8 px-2 text-[10px] sm:px-3 sm:text-xs"
                onClick={() => setDeleteOpen(true)}
              >
                <Trash2 className="mr-1 h-3 w-3 sm:h-3.5 sm:w-3.5" />
                মুছুন
              </Button>
            </div>
          )}
        </div>

        {/* Sources */}
        {question.sources &&
          question.sources.length > 0 && (
            <div className="mt-2.5 flex flex-wrap gap-1.5">
              {question.sources.map((source, i) => (
                <Badge
                  key={i}
                  variant="outline"
                  className="h-6 gap-1 px-2 text-[10px] font-normal"
                >
                  <BookOpen className="h-3 w-3" />

                  <span className="max-w-[180px] truncate">
                    {source.name}
                  </span>

                  {source.year && ` • ${source.year}`}
                </Badge>
              ))}
            </div>
          )}
      </div>

      {/* Body */}
      <div className="space-y-4 px-4 py-4 sm:px-5 sm:py-5">
        {/* Question */}
        <div>
          <h3 className="text-sm leading-6 font-semibold text-foreground sm:text-base sm:leading-7">
            {question.questionText}
          </h3>

          {question.questionImage && (
            <Image
              src={question.questionImage}
              alt="প্রশ্নের ছবি"
              width={700}
              height={400}
              className="mt-3 max-h-[350px] w-full rounded-lg border bg-background object-contain"
            />
          )}
        </div>

        {/* Options */}
        <div className="grid gap-2.5 sm:grid-cols-2">
          {question.options.map((option, i) => (
            <div
              key={option._id ?? option.text}
              className={`rounded-lg border p-3 transition-colors ${
                showAnswer && option.isCorrect
                  ? "border-green-500/50 bg-green-500/10"
                  : "hover:bg-muted"
              }`}
            >
              <div className="flex items-start gap-2.5">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border bg-muted text-[10px] font-semibold sm:h-7 sm:w-7 sm:text-xs">
                  {OPTION_LABELS[i]}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-xs leading-5 sm:text-sm sm:leading-6">
                    {option.text}
                  </p>

                  {option.image && (
                    <Image
                      src={option.image}
                      alt="অপশনের ছবি"
                      width={300}
                      height={150}
                      className="mt-2.5 max-h-32 w-auto rounded-md border object-contain"
                    />
                  )}
                </div>

                {showAnswer && option.isCorrect && (
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-green-600 dark:text-green-400 sm:h-5 sm:w-5" />
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Tags */}
        {question.tags &&
          question.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {question.tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="px-2 py-0.5 text-[10px] font-normal"
                >
                  {tag}
                </Badge>
              ))}
            </div>
          )}

        {/* Answer Button */}
        <Button
          variant="outline"
          size="sm"
          className="h-8 px-3 text-[10px] sm:text-xs"
          onClick={() =>
            setShowAnswer((prev) => !prev)
          }
        >
          {showAnswer ? (
            <>
              উত্তর লুকান
              <ChevronUp className="ml-1.5 h-3.5 w-3.5" />
            </>
          ) : (
            <>
              উত্তর দেখুন
              <ChevronDown className="ml-1.5 h-3.5 w-3.5" />
            </>
          )}
        </Button>

        {/* Explanation */}
        {showAnswer && (
          <div className="rounded-lg border bg-muted/30 p-3.5 sm:p-4">
            <h4 className="flex items-center gap-1.5 text-xs font-semibold sm:text-sm">
              <Lightbulb className="h-4 w-4 text-amber-500" />
              ব্যাখ্যা
            </h4>

            <p className="mt-2.5 text-xs leading-5 whitespace-pre-line text-muted-foreground sm:text-sm sm:leading-6">
              {question.explanation ||
                "কোনো ব্যাখ্যা নেই।"}
            </p>

            {question.explanationImage && (
              <Image
                src={question.explanationImage}
                alt="ব্যাখ্যার ছবি"
                width={700}
                height={400}
                className="mt-3 max-h-[300px] w-full rounded-lg border bg-background object-contain"
              />
            )}
          </div>
        )}
      </div>

      {/* Edit Dialog */}
      {isAdmin && (
        <EditQuestionDialog
          questionId={question._id}
          open={editOpen}
          onOpenChange={setEditOpen}
        />
      )}

      {/* Delete Dialog */}
      {isAdmin && (
        <DeleteQuestionDialog
          question={question}
          open={deleteOpen}
          onOpenChange={setDeleteOpen}
        />
      )}
    </article>
  )
}
