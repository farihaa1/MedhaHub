"use client"

import { useState } from "react"
import Image from "next/image"
import {
  BookOpen,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Lightbulb,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

import { IQuestion } from "@/app/redux/api/questionsApi"

interface Props {
  question: IQuestion
}

const OPTION_LABELS = ["A", "B", "C", "D"]

export default function QuestionCard({ question }: Props) {
  const [showAnswer, setShowAnswer] = useState(false)

  return (
    <article className="overflow-hidden rounded-2xl border bg-card text-card-foreground shadow-sm transition-colors">
      {/* Header */}
      <div className="border-b bg-muted/30 px-8 py-5">
        <div className="flex flex-wrap items-center justify-between gap-3">

          <p className="text-xs text-muted-foreground">
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

        {question.sources && question.sources.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {question.sources.map((source, i) => (
              <Badge key={i} variant="outline" className="gap-1 bg-muted/40">
                <BookOpen className="h-3.5 w-3.5" />
                {source.name}
                {source.year && ` • ${source.year}`}
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* Body */}
      <div className="space-y-6 p-8">
        {/* Question */}
        <div>
          <h3 className="text-xl leading-8 font-semibold text-foreground">
            {question.questionText}
          </h3>

          {question.questionImage && (
            <Image
              src={question.questionImage}
              alt="Question"
              width={700}
              height={400}
              className="mt-5 rounded-xl border bg-background object-contain"
            />
          )}
        </div>

        {/* Options */}
        <div className="grid gap-4 md:grid-cols-2">
          {question.options.map((option, i) => (
            <div
              key={option._id ?? option.text}
              className={`rounded-xl border p-4 transition-all duration-200 ${
                showAnswer && option.isCorrect
                  ? "border-green-500/50 bg-green-500/10"
                  : "hover:bg-muted"
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border bg-muted text-xs font-semibold">
                  {OPTION_LABELS[i]}
                </div>

                <div className="flex-1">
                  <p className="text-sm leading-6">{option.text}</p>

                  {option.image && (
                    <Image
                      src={option.image}
                      alt=""
                      width={300}
                      height={150}
                      className="mt-4 rounded-lg border bg-background"
                    />
                  )}
                </div>

                {showAnswer && option.isCorrect && (
                  <CheckCircle2 className="h-6 w-6 shrink-0 text-green-600 dark:text-green-400" />
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Tags */}
        {question.tags && question.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {question.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="px-3 py-1">
                {tag}
              </Badge>
            ))}
          </div>
        )}

        {/* Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowAnswer((prev) => !prev)}
        >
          {showAnswer ? (
            <>
              Hide Answer
              <ChevronUp className="ml-2 h-4 w-4" />
            </>
          ) : (
            <>
              Show Answer
              <ChevronDown className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>

        {/* Explanation */}
        {showAnswer && (
          <div className="rounded-xl border bg-muted/30 p-6">
            <h4 className="flex items-center gap-2 text-base font-semibold">
              <Lightbulb className="h-5 w-5 text-amber-500" />
              Explanation
            </h4>

            <p className="mt-4 text-sm leading-7 whitespace-pre-line text-muted-foreground">
              {question.explanation || "No explanation available."}
            </p>

            {question.explanationImage && (
              <Image
                src={question.explanationImage}
                alt="Explanation"
                width={700}
                height={400}
                className="mt-5 rounded-xl border bg-background"
              />
            )}
          </div>
        )}
      </div>
    </article>
  )
}
