"use client"

import { useState } from "react"
import Image from "next/image"
import {
  BookOpen,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Lightbulb,
  Tag,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

import { IQuestion } from "@/app/redux/api/questionsApi"

interface Props {
  question: IQuestion
  index: number
}

const OPTION_LABELS = ["A", "B", "C", "D"]

export default function QuestionCard({ question, index }: Props) {
  const [showAnswer, setShowAnswer] = useState(false)

  const difficultyClasses = {
    EASY: "bg-green-100 text-green-700 border-green-300",
    MEDIUM: "bg-yellow-100 text-yellow-700 border-yellow-300",
    HARD: "bg-red-100 text-red-700 border-red-300",
  }

  return (
    <article className="mx-auto rounded-xl border bg-card shadow-sm w-2xl">
      {/* Header */}

      <div className="px-10 pt-6 py-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-xs font-bold text-muted-foreground">
            প্রশ্ন {(index + 1).toLocaleString("bn-BD")}
          </h2>

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

        {/* Sources */}

        {question.sources && question.sources.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {question.sources.map((source, i) => (
              <Badge key={i} variant="secondary" className="gap-1 text-[10px]">
                <BookOpen className="h-3 w-3" />

                {source.name}

                {source.year && ` • ${source.year}`}
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* Question */}

      <div className="px-8 pt-2">
        <h3 className="text-lg leading-8 font-semibold">
          {question.questionText}
        </h3>

        {question.questionImage && (
          <Image
            src={question.questionImage}
            alt="Question"
            width={700}
            height={400}
            className="mt-5 rounded-lg border"
          />
        )}

        {/* Options */}

        <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3">
          {question.options.map((option, i) => (
            <div
              key={option._id ?? option.text}
              className={`rounded-sm border p-4 transition-all ${
                showAnswer && option.isCorrect
                  ? "border-green-500 bg-green-50"
                  : "hover:bg-muted/40"
              }`}
            >
              <div className="flex items-start gap-2">
                <div className="flex h-5 w-5  items-center justify-center rounded-full border bg-muted text-xs font-semibold">
                  {OPTION_LABELS[i]}
                </div>

                <div className="flex-1 text-sm">
                  <p>{option.text}</p>

                  {option.image && (
                    <Image
                      src={option.image}
                      alt=""
                      width={300}
                      height={150}
                      className="mt-3 rounded border"
                    />
                  )}
                </div>

                {showAnswer && option.isCorrect && (
                  <CheckCircle2 className="h-6 w-6 text-green-600" />
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Tags */}

        {question.tags && question.tags.length > 0 && (
          <div className="mt-4">
            <div className="flex flex-wrap gap-2">
              {question.tags.map((tag) => (
                <Badge
                  className="bg-green-100 px-3 py-2"
                  key={tag}
                  variant="outline"
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Button */}

        <Button
          variant="outline"
          size={"xs"}
          className="mt-4 text-[9px] mb-6"
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
          <div className="mb-5 rounded-xl border border-yellow-300 bg-yellow-50 p-5">
            <h4 className="flex items-center gap-2 font-semibold text-yellow-800">
              <Lightbulb className="h-5 w-5" />
              Explanation
            </h4>

            <p className="mt-3 leading-7 whitespace-pre-line text-sm">
              {question.explanation || "No explanation available."}
            </p>

            {question.explanationImage && (
              <Image
                src={question.explanationImage}
                alt="Explanation"
                width={700}
                height={400}
                className="mt-5 rounded-lg border"
              />
            )}
          </div>
        )}
      </div>
    </article>
  )
}
