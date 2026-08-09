"use client"

import { useState } from "react"

import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"

import { toast } from "sonner"

import {
  useCreateQuestionMutation,
  QuestionDifficulty,
  QuestionType,
  QuestionSourceType,
  CreateQuestionPayload,
} from "@/app/redux/api/questionsApi"

import { QuestionLocation } from "./QuestionLocationSelector"

import { Braces, ClipboardPaste, Send, Info, CircleHelp } from "lucide-react"

interface Props {
  location: QuestionLocation
}

/* =========================================================
   JSON TYPES
========================================================= */

interface JsonQuestionOption {
  text: string
  image?: string | null
  isCorrect: boolean
}

interface JsonQuestionSource {
  type: QuestionSourceType
  name: string
  year?: number
}

interface JsonQuestion {
  questionText: string

  questionImage?: string | null

  options: JsonQuestionOption[]

  explanation?: string

  explanationImage?: string | null

  difficulty: QuestionDifficulty

  type: QuestionType

  tags: string[]

  sources: JsonQuestionSource[]
}

/* =========================================================
   COMPONENT
========================================================= */

export default function JsonQuestionsCreateForm({ location }: Props) {
  const [json, setJson] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [createQuestion] = useCreateQuestionMutation()

  /* =======================================================
     SUBMIT
  ======================================================= */

  const submit = async () => {
    /* -----------------------------------------------------
       JSON EMPTY
    ----------------------------------------------------- */

    if (!json.trim()) {
      toast.error("প্রথমে JSON প্রশ্ন পেস্ট করুন।")
      return
    }

    /* -----------------------------------------------------
       LOCATION VALIDATION
    ----------------------------------------------------- */

    if (!location.subjectId) {
      toast.error("প্রথমে বিষয় নির্বাচন করুন।")
      return
    }

    if (!location.chapterId) {
      toast.error("প্রথমে অধ্যায় নির্বাচন করুন।")
      return
    }

    if (!location.topicId) {
      toast.error("প্রথমে টপিক নির্বাচন করুন।")
      return
    }

    setIsSubmitting(true)

    try {
      /* ===================================================
         1. PARSE JSON
      =================================================== */

      const parsed: unknown = JSON.parse(json)

      if (!Array.isArray(parsed)) {
        toast.error("JSON অবশ্যই একটি Array হতে হবে।")
        return
      }

      if (parsed.length === 0) {
        toast.error("JSON-এ কোনো প্রশ্ন পাওয়া যায়নি।")
        return
      }

      const questions = parsed as JsonQuestion[]

      /* ===================================================
         2. PROCESS QUESTIONS
      =================================================== */

      for (let index = 0; index < questions.length; index++) {
        const question = questions[index]

        const number = index + 1

        /* -------------------------------------------------
           QUESTION TEXT
        ------------------------------------------------- */

        if (!question.questionText?.trim()) {
          toast.error(`প্রশ্ন ${number}: questionText প্রয়োজন।`)
          return
        }

        /* -------------------------------------------------
           OPTIONS
        ------------------------------------------------- */

        if (!Array.isArray(question.options) || question.options.length !== 4) {
          toast.error(`প্রশ্ন ${number}: ঠিক ৪টি options থাকতে হবে।`)
          return
        }

        /* -------------------------------------------------
           EMPTY OPTION
        ------------------------------------------------- */

        const hasEmptyOption = question.options.some(
          (option) => !option.text?.trim()
        )

        if (hasEmptyOption) {
          toast.error(`প্রশ্ন ${number}: কোনো option খালি রাখা যাবে না।`)
          return
        }

        /* -------------------------------------------------
           IS CORRECT VALIDATION
        ------------------------------------------------- */

        const correctOptions = question.options.filter(
          (option) => option.isCorrect === true
        )

        if (correctOptions.length !== 1) {
          toast.error(
            `প্রশ্ন ${number}: ঠিক একটি option-এর isCorrect true হতে হবে।`
          )
          return
        }

        /* -------------------------------------------------
           DIFFICULTY
        ------------------------------------------------- */

        if (!Object.values(QuestionDifficulty).includes(question.difficulty)) {
          toast.error(`প্রশ্ন ${number}: difficulty সঠিক নয়।`)
          return
        }

        /* -------------------------------------------------
           TYPE
        ------------------------------------------------- */

        if (question.type !== QuestionType.MCQ) {
          toast.error(`প্রশ্ন ${number}: type অবশ্যই MCQ হতে হবে।`)
          return
        }

        /* -------------------------------------------------
           TAGS
        ------------------------------------------------- */

        if (!Array.isArray(question.tags)) {
          toast.error(`প্রশ্ন ${number}: tags অবশ্যই Array হতে হবে।`)
          return
        }

        /* -------------------------------------------------
           SOURCES
        ------------------------------------------------- */

        if (!Array.isArray(question.sources)) {
          toast.error(`প্রশ্ন ${number}: sources অবশ্যই Array হতে হবে।`)
          return
        }

        /* =================================================
           3. BUILD OPTIONS
        ================================================= */

        const options = question.options.map((option) => ({
          text: option.text.trim(),

          image: option.image?.trim() || null,

          isCorrect: option.isCorrect,
        }))

        /* =================================================
           4. BUILD PAYLOAD
        ================================================= */

        const payload: CreateQuestionPayload = {
          subjectId: location.subjectId,

          chapterId: location.chapterId,

          topicId: location.topicId,

          questionText: question.questionText.trim(),

          questionImage: question.questionImage?.trim() || null,

          options,

          explanation: question.explanation?.trim() || "",

          explanationImage: question.explanationImage?.trim() || null,

          difficulty: question.difficulty,

          type: question.type,

          tags: question.tags.map((tag) => tag.trim()).filter(Boolean),

          sources: question.sources,
        }

        /* =================================================
           5. API
        ================================================= */

        await createQuestion(payload).unwrap()
      }

      /* ===================================================
         SUCCESS
      =================================================== */

      toast.success(`${questions.length}টি প্রশ্ন সফলভাবে যোগ হয়েছে।`)

      setJson("")
    } catch (error: unknown) {
      console.error("JSON question creation error:", error)

      if (error instanceof SyntaxError) {
        toast.error("JSON ফরম্যাট সঠিক নয়।")
      } else {
        toast.error("প্রশ্ন যোগ করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।")
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  /* =======================================================
     UI
  ======================================================= */

  return (
    <div className="space-y-4 text-xs">
      {/* HEADER */}

      <div className="flex items-start gap-3">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Braces className="size-4" />
        </div>

        <div>
          <h2 className="text-xs font-semibold">JSON দিয়ে প্রশ্ন যোগ করুন</h2>

          <p className="mt-1 text-xs text-muted-foreground">
            AI থেকে তৈরি প্রশ্নের JSON এখানে পেস্ট করুন।
          </p>
        </div>
      </div>

      {/* INFO */}

      <div className="flex gap-2 rounded-lg border bg-muted/40 p-3">
        <Info className="mt-0.5 size-4 shrink-0 text-primary" />

        <div className="text-xs">
          <p className="font-medium">গুরুত্বপূর্ণ</p>

          <p className="mt-1 text-xs text-muted-foreground">
            নির্বাচিত বিষয়, অধ্যায় এবং টপিক সব প্রশ্নে স্বয়ংক্রিয়ভাবে
            প্রয়োগ হবে।
          </p>
        </div>
      </div>

      {/* JSON */}

      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <ClipboardPaste className="size-3.5 text-muted-foreground" />

          <label className="text-xs font-medium">JSON</label>
        </div>

        <Textarea
          value={json}
          onChange={(e) => setJson(e.target.value)}
          disabled={isSubmitting}
          className="min-h-[420px] resize-y rounded-lg bg-muted/20 font-mono text-xs leading-5"
          placeholder={`[
  {
    "questionText": "বাংলা ভাষার প্রথম ব্যাকরণ রচয়িতা কে?",
    "options": [
      {
        "text": "রাজা রামমোহন রায়",
        "isCorrect": false
      },
      {
        "text": "নাথানিয়েল ব্রাসি হ্যালহেড",
        "isCorrect": true
      },
      {
        "text": "ঈশ্বরচন্দ্র বিদ্যাসাগর",
        "isCorrect": false
      },
      {
        "text": "বঙ্কিমচন্দ্র চট্টোপাধ্যায়",
        "isCorrect": false
      }
    ],
    "explanation": "নাথানিয়েল ব্রাসি হ্যালহেড বাংলা ভাষার প্রথম ব্যাকরণ রচনা করেন।",
    "difficulty": "EASY",
    "type": "MCQ",
    "tags": ["BCS", "বাংলা"],
    "sources": [
      {
        "type": "bcs",
        "name": "BCS Preliminary",
        "year": 46
      }
    ]
  }
]`}
        />

        <div className="flex items-start gap-2 text-xs text-muted-foreground">
          <CircleHelp className="mt-0.5 size-3.5 shrink-0" />

          <p className="text-xs">
            একটি Array দিন। প্রতিটি প্রশ্নে ৪টি option এবং ঠিক একটি option-এ{" "}
            <code className="rounded bg-muted px-1">isCorrect: true</code> থাকতে
            হবে।
          </p>
        </div>
      </div>

      {/* BUTTON */}

      <div className="flex justify-end border-t pt-4">
        <Button
          type="button"
          onClick={submit}
          disabled={isSubmitting || !json.trim()}
          size="sm"
          className="h-8 gap-2 text-xs"
        >
          <Send className="size-3.5" />

          {isSubmitting ? "প্রশ্ন যোগ হচ্ছে..." : "প্রশ্ন যোগ করুন"}
        </Button>
      </div>
    </div>
  )
}
