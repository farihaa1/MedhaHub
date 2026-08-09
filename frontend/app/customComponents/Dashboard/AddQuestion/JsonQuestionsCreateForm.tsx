
"use client"

import { useState } from "react"

import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

import { useCreateQuestionSubmissionMutation } from "@/app/redux/api/questionSubmissionApi"
import { QuestionLocation } from "./QuestionLocationSelector"

interface Props {
  location: QuestionLocation
}

type OptionLabel = "A" | "B" | "C" | "D"

interface JsonQuestionOption {
  label: OptionLabel
  text: string
}

interface JsonQuestion {
  questionText: string
  options: JsonQuestionOption[]
  correctAnswer: OptionLabel
  explanation?: string
  tags?: string[]
}

export default function JsonQuestionsCreateForm({ location }: Props) {
  const [json, setJson] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [createSubmission] = useCreateQuestionSubmissionMutation()

  const submit = async () => {
    if (!json.trim()) {
      toast.error("Please paste JSON questions first")
      return
    }

    setIsSubmitting(true)

    try {
      // ---------------------------------------
      // 1. Parse JSON
      // ---------------------------------------
      const parsed: unknown = JSON.parse(json)

      if (!Array.isArray(parsed)) {
        toast.error("JSON must be an array of questions")
        return
      }

      const questions = parsed as JsonQuestion[]

      if (questions.length === 0) {
        toast.error("No questions found in JSON")
        return
      }

      // ---------------------------------------
      // 2. Validate and submit questions
      // ---------------------------------------
      for (let index = 0; index < questions.length; index++) {
        const question = questions[index]

        if (!question.questionText?.trim()) {
          toast.error(`Question ${index + 1}: questionText is required`)
          return
        }

        if (
          !Array.isArray(question.options) ||
          question.options.length !== 4
        ) {
          toast.error(
            `Question ${index + 1}: exactly 4 options are required`
          )
          return
        }

        const expectedLabels: OptionLabel[] = ["A", "B", "C", "D"]

        const labels = question.options.map((option) => option.label)

        const hasValidLabels = expectedLabels.every((label) =>
          labels.includes(label)
        )

        if (!hasValidLabels) {
          toast.error(
            `Question ${index + 1}: options must contain A, B, C and D`
          )
          return
        }

        if (!["A", "B", "C", "D"].includes(question.correctAnswer)) {
          toast.error(
            `Question ${index + 1}: correctAnswer must be A, B, C or D`
          )
          return
        }

        const hasEmptyOption = question.options.some(
          (option) => !option.text?.trim()
        )

        if (hasEmptyOption) {
          toast.error(
            `Question ${index + 1}: option text cannot be empty`
          )
          return
        }

        // ---------------------------------------
        // 3. Convert JSON options
        //    into backend IQuestionOption format
        // ---------------------------------------
        const options = question.options.map((option) => ({
          label: option.label,
          text: option.text,
          isCorrect: option.label === question.correctAnswer,
        }))

        // ---------------------------------------
        // 4. Create API payload
        // ---------------------------------------
        const payload = {
          subjectId: location.subjectId,

          chapterId: location.chapterId || undefined,

          topicId: location.topicId || undefined,

          suggestedChapterTitle:
            location.suggestedChapterTitle || undefined,

          suggestedTopicTitle:
            location.suggestedTopicTitle || undefined,

          questionText: question.questionText.trim(),

          options,

          correctAnswer: question.correctAnswer,

          explanation: question.explanation?.trim() || "",

          tags: question.tags || [],
        }

        // ---------------------------------------
        // 5. Submit
        // ---------------------------------------
        await createSubmission(payload).unwrap()
      }

      // ---------------------------------------
      // 6. Success
      // ---------------------------------------
      toast.success(
        `${questions.length} question${
          questions.length > 1 ? "s" : ""
        } submitted for review`
      )

      setJson("")
    } catch (error: unknown) {
      console.error("JSON question submission error:", error)

      /*
       * JSON.parse errors come here, but API errors can also
       * come here because of createSubmission().unwrap().
       */

      if (error instanceof SyntaxError) {
        toast.error("Invalid JSON format")
      } else {
        toast.error("Failed to submit questions")
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold">
          JSON Question Import
        </h3>

        <p className="mt-1 text-sm text-muted-foreground">
          Generate questions from ChatGPT and paste them here.
          The selected location above will apply to every question.
        </p>
      </div>

      <Textarea
        className="min-h-80 resize-y font-mono text-sm"
        placeholder={`[
  {
    "questionText": "বাংলা ভাষার প্রথম ব্যাকরণ রচয়িতা কে?",
    "options": [
      {
        "label": "A",
        "text": "রাজা রামমোহন রায়"
      },
      {
        "label": "B",
        "text": "নাথানিয়েল ব্রাসি হ্যালহেড"
      },
      {
        "label": "C",
        "text": "ঈশ্বরচন্দ্র বিদ্যাসাগর"
      },
      {
        "label": "D",
        "text": "বঙ্কিমচন্দ্র"
      }
    ],
    "correctAnswer": "B",
    "explanation": "নাথানিয়েল ব্রাসি হ্যালহেড বাংলা ভাষার প্রথম ব্যাকরণ রচনা করেন।",
    "tags": [
      "BCS",
      "Bangla"
    ]
  }
]`}
        value={json}
        onChange={(e) => setJson(e.target.value)}
        disabled={isSubmitting}
      />

      <div className="flex justify-end">
        <Button
          onClick={submit}
          disabled={isSubmitting || !json.trim()}
        >
          {isSubmitting ? "Submitting..." : "Submit JSON Questions"}
        </Button>
      </div>
    </div>
  )
}
