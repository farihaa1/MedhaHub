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

interface JsonQuestion {
  questionText: string

  options: {
    label: "A" | "B" | "C" | "D"

    text: string
  }[]

  correctAnswer: "A" | "B" | "C" | "D"

  explanation?: string

  tags?: string[]
}

export default function JsonQuestionsCreateForm({ location }: Props) {
  const [json, setJson] = useState("")

  const [createSubmission] = useCreateQuestionSubmissionMutation()

  const submit = async () => {
    try {
      const questions: JsonQuestion[] = JSON.parse(json)

      if (!Array.isArray(questions)) {
        toast.error("JSON must be an array of questions")

        return
      }

      for (const question of questions) {
        if (
          !question.questionText ||
          !question.options ||
          question.options.length !== 4
        ) {
          toast.error("Invalid question format")

          return
        }

        const payload = {
          subjectId: location.subjectId,

          chapterId: location.chapterId || undefined,

          topicId: location.topicId || undefined,

          suggestedChapterTitle: location.suggestedChapterTitle || undefined,

          suggestedTopicTitle: location.suggestedTopicTitle || undefined,

          questionText: question.questionText,

          options: question.options,

          correctAnswer: question.correctAnswer,

          explanation: question.explanation || "",

          tags: question.tags || [],
        }

        await createSubmission(payload).unwrap()
      }

      toast.success(`${questions.length} questions submitted for review`)

      setJson("")
    } catch (error) {
      console.log(error)

      toast.error("Invalid JSON format")
    }
  }

  return (
    <div className="space-y-6 rounded-xl border p-6">
      <h2 className="font-semibold">JSON Question Import</h2>

      <p className="text- text-muted-foreground">
        Generate questions from ChatGPT and paste here. Location selected above
        will apply to every question.
      </p>

      <Textarea
        className="min-h-80 font-mono"

        placeholder={`[
 {
  "questionText":"বাংলা ভাষার প্রথম ব্যাকরণ রচয়িতা কে?",

  "options":[
   {
    "label":"A",
    "text":"রাজা রামমোহন রায়"
   },
   {
    "label":"B",
    "text":"নাথানিয়েল ব্রাসি হ্যালহেড"
   },
   {
    "label":"C",
    "text":"ঈশ্বরচন্দ্র বিদ্যাসাগর"
   },
   {
    "label":"D",
    "text":"বঙ্কিমচন্দ্র"
   }
  ],

  "correctAnswer":"B",

  "tags":[
    "BCS",
    "Bangla"
  ]
 }
]

`}

        value={json}

        onChange={(e) => setJson(e.target.value)}
      />

      <Button onClick={submit}>Submit JSON Questions</Button>
    </div>
  )
}
