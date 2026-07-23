"use client"

import Image from "next/image"
import { CheckCircle2, FileText } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

import { IQuestion, IEntityRef } from "@/app/redux/api/questionsApi"

interface QuestionPreviewProps {
  question: IQuestion
}

function getTitle(value: string | IEntityRef | undefined) {
  if (!value) return "-"

  if (typeof value === "string") {
    return value
  }

  return value.title
}

export default function QuestionPreview({ question }: QuestionPreviewProps) {
  return (
    <div className="space-y-6">
      {/* ================= Metadata ================= */}

      <div className="flex flex-wrap gap-2">
        <Badge variant="secondary">{getTitle(question.subjectId)}</Badge>

        <Badge variant="secondary">{getTitle(question.chapterId)}</Badge>

        <Badge variant="secondary">{getTitle(question.topicId)}</Badge>

        <Badge>{question.type}</Badge>

        {question.difficulty && (
          <Badge variant="outline">{question.difficulty}</Badge>
        )}

        <Badge
          variant={question.status === "APPROVED" ? "default" : "secondary"}
        >
          {question.status}
        </Badge>
      </div>

      <Separator />

      {/* ================= Question ================= */}

      <div className="space-y-3">
        <h2 className="text-xl font-semibold">Question</h2>

        <p className="leading-7 whitespace-pre-wrap">{question.questionText}</p>

        {question.questionImage && (
          <Image
            src={question.questionImage}
            alt="Question Image"
            width={900}
            height={500}
            className="rounded-lg border object-contain"
          />
        )}
      </div>

      <Separator />

      {/* ================= Options ================= */}

      <div className="space-y-3">
        <h2 className="font-semibold">Options</h2>

        {question.options.map((option, index) => (
          <div
            key={option._id ?? index}
            className={`rounded-lg border p-4 ${
              option.isCorrect
                ? "border-green-500 bg-green-50 dark:bg-green-950/30"
                : ""
            }`}
          >
            <div className="flex items-start gap-3">
              <div className="font-bold">
                {String.fromCharCode(65 + index)}.
              </div>

              <div className="flex-1 space-y-2">
                <p>{option.text}</p>

                {option.image && (
                  <Image
                    src={option.image}
                    alt={`Option ${index + 1}`}
                    width={500}
                    height={250}
                    className="rounded border"
                  />
                )}
              </div>

              {option.isCorrect && (
                <CheckCircle2 className="h-5 w-5 text-green-600" />
              )}
            </div>
          </div>
        ))}
      </div>

      {/* ================= Explanation ================= */}

      {question.explanation && (
        <>
          <Separator />

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5" />

              <h2 className="font-semibold">Explanation</h2>
            </div>

            <p className="leading-7 whitespace-pre-wrap">
              {question.explanation}
            </p>

            {question.explanationImage && (
              <Image
                src={question.explanationImage}
                alt="Explanation"
                width={700}
                height={350}
                className="rounded-lg border"
              />
            )}
          </div>
        </>
      )}

      <Separator />

      {/* ================= Footer ================= */}

      <div className="grid gap-5 md:grid-cols-4">
        <div>
          <p className="text-sm text-muted-foreground">Marks</p>

          <p className="font-semibold">{question.marks ?? 1}</p>
        </div>

        <div>
          <p className="text-sm text-muted-foreground">Negative Marks</p>

          <p className="font-semibold">{question.negativeMarks ?? 0}</p>
        </div>

        <div>
          <p className="text-sm text-muted-foreground">Sources</p>

          <div className="mt-2 flex flex-wrap gap-2">
            {question.sources?.length ? (
              question.sources.map((source, index) => (
                <Badge key={index} variant="outline">
                  {source.type}
                  {source.year && ` (${source.year})`}
                </Badge>
              ))
            ) : (
              <span className="text-sm text-muted-foreground">-</span>
            )}
          </div>
        </div>

        <div>
          <p className="text-sm text-muted-foreground">Tags</p>

          <div className="mt-2 flex flex-wrap gap-2">
            {question.tags?.length ? (
              question.tags.map((tag) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))
            ) : (
              <span className="text-sm text-muted-foreground">-</span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
