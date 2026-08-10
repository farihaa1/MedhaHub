"use client"

import { useState } from "react"
import { useForm, useFieldArray, Controller } from "react-hook-form"

import { questionSchema, QuestionFormValues } from "./questionSchema"
import { QuestionLocation } from "./QuestionLocationSelector"
import QuestionImageUpload from "./QuestionImageUpload"

import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { toast } from "sonner"

import {
  useCreateQuestionMutation,
  QuestionDifficulty,
  QuestionSourceType,
  QuestionType,
  CreateQuestionPayload,
} from "@/app/redux/api/questionsApi"

import { Plus, Trash2, Send, ImageIcon } from "lucide-react"

/* =========================================================
   TYPES
========================================================= */

type OptionLabel = "A" | "B" | "C" | "D"

const optionLabels: OptionLabel[] = ["A", "B", "C", "D"]

/* =========================================================
   SOURCE OPTIONS
========================================================= */

const sourceOptions = [
  {
    label: "BCS",
    value: QuestionSourceType.BCS,
  },
  {
    label: "NTRCA",
    value: QuestionSourceType.NTRCA,
  },
  {
    label: "PSC Non-Cadre",
    value: QuestionSourceType.PSC_NON_CADRE,
  },
  {
    label: "Bank",
    value: QuestionSourceType.BANK,
  },
  {
    label: "Government",
    value: QuestionSourceType.GOVERNMENT,
  },
  {
    label: "Defence",
    value: QuestionSourceType.DEFENCE,
  },
  {
    label: "Health",
    value: QuestionSourceType.HEALTH,
  },
  {
    label: "Admission",
    value: QuestionSourceType.ADMISSION,
  },
  {
    label: "Teacher",
    value: QuestionSourceType.TEACHER,
  },
  {
    label: "Others",
    value: QuestionSourceType.OTHERS,
  },
  {
    label: "Custom",
    value: QuestionSourceType.CUSTOM,
  },
]

/* =========================================================
   DEFAULT VALUES
========================================================= */

const defaultValues: QuestionFormValues = {
  questionText: "",

  questionImage: "",

  options: [
    {
      label: "A",
      text: "",
      image: "",
    },
    {
      label: "B",
      text: "",
      image: "",
    },
    {
      label: "C",
      text: "",
      image: "",
    },
    {
      label: "D",
      text: "",
      image: "",
    },
  ],

  correctAnswer: "A",

  explanation: "",

  explanationImage: "",

  difficulty: QuestionDifficulty.EASY,

  tags: [],

  sources: [],
}

/* =========================================================
   PROPS
========================================================= */

interface Props {
  location: QuestionLocation
}

/* =========================================================
   COMPONENT
========================================================= */

export default function QuestionCreateForm({ location }: Props) {
  const [tagInput, setTagInput] = useState("")

  /* =======================================================
     FORM
  ======================================================= */

  const {
    register,
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<QuestionFormValues>({
    defaultValues,
  })

  /* =======================================================
     OPTIONS
  ======================================================= */

  const { fields: optionFields } = useFieldArray({
    control,
    name: "options",
  })

  /* =======================================================
     SOURCES
  ======================================================= */

  const {
    fields: sourceFields,
    append: appendSource,
    remove: removeSource,
  } = useFieldArray({
    control,
    name: "sources",
  })

  /* =======================================================
     API
  ======================================================= */

  const [createQuestion] = useCreateQuestionMutation()

  /* =======================================================
     WATCH
  ======================================================= */

  const questionImage = watch("questionImage")

  const explanationImage = watch("explanationImage")

  const optionValues = watch("options")

  /* =======================================================
     SUBMIT
  ======================================================= */

  const onSubmit = async (data: QuestionFormValues): Promise<void> => {
    /* -----------------------------------------------------
       LOCATION VALIDATION
    ----------------------------------------------------- */

    if (!location.subjectId) {
      toast.error("বিষয় নির্বাচন করুন।")
      return
    }

    if (!location.chapterId) {
      toast.error("অধ্যায় নির্বাচন করুন।")
      return
    }

    if (!location.topicId) {
      toast.error("টপিক নির্বাচন করুন।")
      return
    }

    /* -----------------------------------------------------
       ZOD VALIDATION
    ----------------------------------------------------- */

    const validation = questionSchema.safeParse(data)

    if (!validation.success) {
      const firstError = validation.error.issues[0]

      toast.error(firstError?.message ?? "প্রশ্নের তথ্য সঠিক নয়।")

      return
    }

    const formData = validation.data

    try {
      /* ===================================================
         TAGS
      =================================================== */

      const tags = tagInput
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag): tag is string => tag.length > 0)

      /* ===================================================
         CORRECT ANSWER
      =================================================== */

      const correctAnswer = formData.correctAnswer

      /* ===================================================
         OPTIONS
         
         IMPORTANT:
         API does NOT need label/correctAnswer.
         
         It needs:
         { 

           text,
           image,
           isCorrect
         }
      =================================================== */

      const options = formData.options.map((option) => ({
        text: option.text.trim(),

        image: option.image?.trim() || null,

        isCorrect: option.label === correctAnswer,
      }))

      /* ===================================================
         SOURCES
      =================================================== */

      const sources = formData.sources.map((source) => ({
        type: source.type,

        name: source.name.trim(),

        ...(source.year !== undefined && !Number.isNaN(source.year)
          ? {
              year: Number(source.year),
            }
          : {}),
      }))

      /* ===================================================
         PAYLOAD
         
         THIS MUST MATCH:
         CreateQuestionPayload
         
         Same structure as JSON importer.
      =================================================== */

      const payload: CreateQuestionPayload = {
        subjectId: location.subjectId,

        chapterId: location.chapterId,

        topicId: location.topicId,

        questionText: formData.questionText.trim(),

        questionImage: formData.questionImage?.trim() || null,

        options,

        explanation: formData.explanation?.trim() || "",

        explanationImage: formData.explanationImage?.trim() || null,

        difficulty: formData.difficulty,

        type: QuestionType.MCQ,

        tags,

        sources,
      }

      console.log("CREATE QUESTION PAYLOAD:", payload)

      /* ===================================================
         API REQUEST
      =================================================== */

      await createQuestion(payload).unwrap()

      /* ===================================================
         SUCCESS
      =================================================== */

      toast.success("প্রশ্ন সফলভাবে তৈরি হয়েছে।")

      reset(defaultValues)

      setTagInput("")
    } catch (error: unknown) {
      console.error("Question creation error:", error)

      /* ---------------------------------------------------
         RTK QUERY ERROR
      --------------------------------------------------- */

      if (typeof error === "object" && error !== null && "data" in error) {
        const apiError = error as {
          data?: {
            message?: string
            error?: string
          }
        }

        toast.error(
          apiError.data?.message ??
            apiError.data?.error ??
            "প্রশ্ন তৈরি করতে সমস্যা হয়েছে।"
        )

        return
      }

      /* ---------------------------------------------------
         NORMAL ERROR
      --------------------------------------------------- */

      if (error instanceof Error) {
        toast.error(error.message)
        return
      }

      toast.error("প্রশ্ন তৈরি করতে সমস্যা হয়েছে।")
    }
  }

  /* =======================================================
     UI
  ======================================================= */

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* =================================================
          QUESTION
      ================================================= */}

      <section className="space-y-3">
        <div>
          <h3 className="text-sm font-semibold">প্রশ্ন</h3>

          <p className="text-xs text-muted-foreground">
            প্রশ্নের লেখা এবং প্রয়োজনে ছবি যোগ করুন।
          </p>
        </div>

        <Textarea
          {...register("questionText")}
          placeholder="প্রশ্ন লিখুন..."
          className="min-h-[110px] resize-y text-sm"
        />

        {errors.questionText && (
          <p className="text-xs text-destructive">
            {errors.questionText.message}
          </p>
        )}

        <QuestionImageUpload
          value={questionImage}
          onChange={(url) =>
            setValue("questionImage", url, {
              shouldDirty: true,
              shouldValidate: true,
            })
          }
          label="প্রশ্নের ছবি"
        />
      </section>

      {/* =================================================
          OPTIONS
      ================================================= */}

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold">উত্তর বিকল্প</h3>

            <p className="text-xs text-muted-foreground">
              লেখা, ছবি অথবা দুটোই ব্যবহার করতে পারবেন।
            </p>
          </div>

          <span className="rounded-md bg-muted px-2 py-1 text-xs text-muted-foreground">
            ৪টি
          </span>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {optionFields.map((field, index) => {
            const optionImage = optionValues?.[index]?.image

            return (
              <div key={field.id} className="rounded-lg border p-3">
                <div className="flex items-start gap-2">
                  {/* OPTION LABEL */}

                  <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-muted text-xs font-semibold">
                    {field.label}
                  </div>

                  <div className="min-w-0 flex-1 space-y-2">
                    {/* OPTION TEXT */}

                    <Input
                      {...register(`options.${index}.text`)}
                      placeholder={`বিকল্প ${field.label}`}
                      className="h-9 text-sm"
                    />

                    {/* OPTION IMAGE */}

                    <QuestionImageUpload
                      value={optionImage}
                      label={`বিকল্প ${field.label}-এর ছবি`}
                      size="small"
                      onChange={(url) =>
                        setValue(`options.${index}.image`, url, {
                          shouldDirty: true,
                          shouldValidate: true,
                        })
                      }
                    />
                  </div>
                </div>

                {errors.options?.[index]?.text && (
                  <p className="mt-2 text-xs text-destructive">
                    {errors.options[index]?.text?.message}
                  </p>
                )}
              </div>
            )
          })}
        </div>
      </section>

      {/* =================================================
          ANSWER + DIFFICULTY
      ================================================= */}

      <div className="grid gap-4 md:grid-cols-2">
        {/* CORRECT ANSWER */}

        <section className="space-y-2">
          <h3 className="text-sm font-semibold">সঠিক উত্তর</h3>

          <Controller
            control={control}
            name="correctAnswer"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="h-9 text-sm">
                  <SelectValue placeholder="সঠিক উত্তর" />
                </SelectTrigger>

                <SelectContent>
                  {optionLabels.map((option) => (
                    <SelectItem key={option} value={option} className="text-sm">
                      বিকল্প {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />

          {errors.correctAnswer && (
            <p className="text-xs text-destructive">
              {errors.correctAnswer.message}
            </p>
          )}
        </section>

        {/* DIFFICULTY */}

        <section className="space-y-2">
          <h3 className="text-sm font-semibold">কঠিনতার মাত্রা</h3>

          <Controller
            control={control}
            name="difficulty"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="h-9 text-sm">
                  <SelectValue placeholder="কঠিনতা নির্বাচন করুন" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value={QuestionDifficulty.EASY}>সহজ</SelectItem>

                  <SelectItem value={QuestionDifficulty.MEDIUM}>
                    মাঝারি
                  </SelectItem>

                  <SelectItem value={QuestionDifficulty.HARD}>কঠিন</SelectItem>
                </SelectContent>
              </Select>
            )}
          />

          {errors.difficulty && (
            <p className="text-xs text-destructive">
              {errors.difficulty.message}
            </p>
          )}
        </section>
      </div>

      {/* =================================================
          EXPLANATION
      ================================================= */}

      <section className="space-y-3">
        <div>
          <h3 className="text-sm font-semibold">ব্যাখ্যা</h3>

          <p className="text-xs text-muted-foreground">
            সঠিক উত্তরের ব্যাখ্যা এবং প্রয়োজনে ছবি যোগ করুন।
          </p>
        </div>

        <Textarea
          {...register("explanation")}
          placeholder="সঠিক উত্তরের ব্যাখ্যা লিখুন..."
          className="min-h-[100px] resize-y text-sm"
        />

        <QuestionImageUpload
          value={explanationImage}
          onChange={(url) =>
            setValue("explanationImage", url, {
              shouldDirty: true,
              shouldValidate: true,
            })
          }
          label="ব্যাখ্যার ছবি"
        />
      </section>

      {/* =================================================
          TAGS
      ================================================= */}

      <section className="space-y-2">
        <h3 className="text-sm font-semibold">ট্যাগ</h3>

        <Input
          value={tagInput}
          onChange={(event) => setTagInput(event.target.value)}
          placeholder="BCS, বাংলা, ব্যাকরণ"
          className="h-9 text-sm"
        />

        <p className="text-xs text-muted-foreground">
          একাধিক ট্যাগ কমা দিয়ে আলাদা করুন।
        </p>
      </section>

      {/* =================================================
          SOURCES
      ================================================= */}

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold">প্রশ্নের উৎস</h3>

            <p className="text-xs text-muted-foreground">
              প্রশ্নটি কোন পরীক্ষা বা উৎস থেকে এসেছে তা যোগ করুন।
            </p>
          </div>

          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-8 gap-1.5 px-2.5 text-xs"
            onClick={() =>
              appendSource({
                type: QuestionSourceType.CUSTOM,
                name: "",
                year: undefined,
              })
            }
          >
            <Plus className="size-3.5" />
            উৎস যোগ করুন
          </Button>
        </div>

        {/* NO SOURCES */}

        {sourceFields.length === 0 && (
          <div className="flex items-center gap-2 rounded-lg border border-dashed p-4 text-xs text-muted-foreground">
            <ImageIcon className="size-4" />
            কোনো উৎস যোগ করা হয়নি।
          </div>
        )}

        {/* SOURCE LIST */}

        <div className="space-y-2">
          {sourceFields.map((field, index) => (
            <div
              key={field.id}
              className="grid gap-2 rounded-lg border p-2 md:grid-cols-[170px_1fr_100px_auto]"
            >
              {/* TYPE */}

              <Controller
                control={control}
                name={`sources.${index}.type`}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="h-9 text-sm">
                      <SelectValue placeholder="উৎস" />
                    </SelectTrigger>

                    <SelectContent>
                      {sourceOptions.map((source) => (
                        <SelectItem
                          key={source.value}
                          value={source.value}
                          className="text-sm"
                        >
                          {source.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />

              {/* NAME */}

              <Input
                {...register(`sources.${index}.name`)}
                placeholder="উৎসের নাম"
                className="h-9 text-sm"
              />

              {/* YEAR */}

              <Input
                type="number"
                placeholder="বছর"
                className="h-9 text-sm"
                {...register(`sources.${index}.year`, {
                  setValueAs: (value) => {
                    if (value === "" || value === undefined) {
                      return undefined
                    }

                    const number = Number(value)

                    return Number.isNaN(number) ? undefined : number
                  },
                })}
              />

              {/* REMOVE */}

              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="size-9"
                onClick={() => removeSource(index)}
              >
                <Trash2 className="size-3.5" />
              </Button>
            </div>
          ))}
        </div>
      </section>

      {/* =================================================
          SUBMIT
      ================================================= */}

      <div className="flex justify-end border-t pt-4">
        <Button
          type="submit"
          disabled={isSubmitting}
          size="sm"
          className="h-9 gap-2 px-4 text-xs"
        >
          <Send className="size-3.5" />

          {isSubmitting ? "সংরক্ষণ হচ্ছে..." : "প্রশ্ন তৈরি করুন"}
        </Button>
      </div>
    </form>
  )
}
